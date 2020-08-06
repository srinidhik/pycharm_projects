import StringIO
from bson import ObjectId
from django.core.exceptions import PermissionDenied
import requests
import zipfile
from rest_framework.response import Response
from CustomCurtains.constants import *
from CustomCurtains.upload_constant import CurtainConstants
from InventoryManagement.utils import str2bool
from UserManagement.staff_permissions import staffHasAccessTo
from rest_framework.views import APIView
import xlrd
from Utils.S3Management import FileManagement


class UploadCurtains(APIView):
    def post(self, request):
        try:
            if staffHasAccessTo().list_view_uploader(request.user):
                data = CurtainsBulkUpload(request).run()
                return Response(data, 200)
            else:
                raise PermissionDenied()
        except Exception as e:
            return Response(str(e), 500)


class CurtainsBulkUpload:
    def __init__(self, request):
        self.fail_data = {"filter fail": [], "No Seamless": [], "No Category": [], "No Price": [],
                          "Image Not Found": [], "Upload Failed": []}
        self.zip_folder = request.FILES.get('zipFileCurtain')
        self.workbook = xlrd.open_workbook(file_contents=request.FILES.get('sheetFileCurtain').read())
        self.curtain_type = request.POST.get('zipFolderType')
        self.zoom = request.POST.get('zipCurtainType', None)
        self.is_in_debug = str2bool(request.POST.get('debug'))
        self.swatch_flag = str2bool(request.POST.get('swatchFlag', False))
        self.is_fabric = str2bool(request.POST.get('isFabric', False))
        self.constant = CurtainConstants()
        self.mode = self.constant.mode
        self.file_management = FileManagement(self.constant.AWS_BUCKET_NAME)
        self.skuids = {}
        self.extracted_zip = zipfile.ZipFile(self.zip_folder)
        self.change_position = 1
        self.pop_out_position = 2
        self.shade_types = request.POST.getlist('shadetype')
        self.curtain_types = request.POST.getlist('curtaintype')
        self.product_id = None
        self.product_name = None
        self.root = None
        self.names_dict = {}
        self.colors_filters_map = {}
        self.pattern_filters_map = {}
        self.material_filters_map = {}
        self.material_description = {}

    def run(self):
        try:
            files = zipfile.ZipFile(StringIO.StringIO(self.extracted_zip.read('skuids.zip'))).namelist()
        except:
            raise Exception("No skuids.zip file found in uploaded zip")
        for f in files:
            if f.endswith(".jpg" or ".JPG"):
                self.skuids[f[f.rfind('/') + 1: f.rfind('.jpg')]] = f.split('/')[-2]

        result = {}
        dir_list = {}
        if self.curtain_type == "shades":
            shade_types = self.shade_types
            if self.mode == "TEST":
                if len(shade_types) == 0:
                    dir_list = SHADES_TYPES.TEST
                else:
                    for k in shade_types:
                        dir_list[k] = SHADES_TYPES.TEST[k]
            else:
                if len(shade_types) == 0:
                    dir_list = SHADES_TYPES.PRODUCTION
                else:
                    for k in shade_types:
                        dir_list[k] = SHADES_TYPES.PRODUCTION[k]

        else:
            curtain_types = self.curtain_types
            if len(curtain_types) == 0:
                dir_list = CURTAINS.TYPES
            else:
                for k in curtain_types:
                    dir_list[k] = CURTAINS.TYPES[k]
        print dir_list

        self.names_dict = self.get_filter_map("MAPPING_NAMES")
        self.colors_filters_map = self.get_filter_map("COLOR")
        self.pattern_filters_map = self.get_filter_map("PATTERN")
        self.material_filters_map = self.get_filter_map("MATERIAL")
        self.material_description = self.get_filter_map("MATERIAL_DESCRIPTION")

        for name, value in dir_list.items():
            self.product_id = value
            self.product_name = name

            if not self.is_fabric:
                if self.curtain_type == "curtains" and self.zoom == "zoom":
                    self.root = self.curtain_type + '/3D_second/' + name
                else:
                    self.root = self.curtain_type + '/3D/' + name
            else:
                self.root = self.curtain_type + '/1000X500/' + name


            # Use the list dir for compressing the image first from the progressive images py file.

            # First test the files with true and then put false and upload.

            print self.product_id
            length = self._initialize_data()

            result[name] = length

        data = dict()
        data["successData"] = result
        data["failed"] = self.fail_data
        return data

    def create_url(self, root, file_name, url, swatch_flag=False):
        test = self.is_in_debug
        s3_file_name = ObjectId()
        try:
            if swatch_flag:
                try:
                    image_file = self.extracted_zip.read('default.jpg')
                except:
                    image_file = self.extracted_zip.read('default.JPG')
            else:
                try:
                    image_file = self.extracted_zip.read(root + '/' + self.skuids[file_name] + '/' + file_name + '.jpg')
                except:
                    image_file = self.extracted_zip.read(root + '/' + self.skuids[file_name] + '/' + file_name + '.JPG')
        except:
            return None

        if not test:
            image_url = self.file_management.upload_string(image_file, s3_file_name, content_type="image/jpeg")
            image_url = image_url.split(":")
            image_url[0] = "http"
            image_url = ":".join(image_url)

            # zoom image start
            if "/3D_second/" in root and not self.swatch_flag:
                if self.curtain_type == "curtains" and self.zoom == "zoom":
                    new_root_zoom = root.split("/")
                    new_root_zoom[self.change_position] = "zoom"
                    new_root_zoom = "/".join(new_root_zoom)
                    try:
                        try:
                            zoom_image_file = self.extracted_zip.read(
                                new_root_zoom + '/' + self.skuids[file_name] + '/' + file_name + '.jpg')
                        except:
                            zoom_image_file = self.extracted_zip.read(
                                new_root_zoom + '/' + self.skuids[file_name] + '/' + file_name + '.JPG')

                    except:
                        return None

                    self.file_management.upload_string(zoom_image_file, str(s3_file_name) + '_zoom', content_type="image/jpeg")
                    # zoom image end

        else:
            image_url = url

        return image_url

    def create_new_root(self, path_change):
        root = self.root
        new_root_for_display = root.split("/")
        new_root_for_display[self.change_position] = path_change
        if self.pop_out_position and not self.is_fabric:
            new_root_for_display.pop(self.pop_out_position)
        new_root = "/".join(new_root_for_display)
        return new_root

    def upload_image(self, file):
        root=self.root
        working_image_url = self.create_url(root,file,"a", self.swatch_flag)

        new_root_for_display = self.create_new_root("for_display")
        display_image_url = self.create_url(new_root_for_display, file, "b")
        data = {
            "url": display_image_url,
            "name": file.split(".JPG")[0].split(".jpg")[0],
            "priority": 1
        }

        new_root_for_zoom = self.create_new_root("for_zoom")
        zoom_image_url = self.create_url(new_root_for_zoom, file, "c")

        if zoom_image_url and working_image_url and display_image_url:
            return data, working_image_url, zoom_image_url
        else:
            return None, None, None

    # def pre_read_files(folder_path):
    #     for root, parent, files in os.walk(folder_path):
    #         for file in files:
    #             if file.endswith(".png"):
    #                 print "skipping: ",file
    #                 continue
    #             file_name = file.split(".jpg")[0].split(".JPG")[0]
    #             source_file = os.path.join(root, *[file])
    #             dest_file = os.path.join(root, *[file_name + ".jpg"])
    #             os.rename(source_file, dest_file)
    #             # print dest_file

    def rephrase_filters(self, row_data):
        row_data["filters"] = []
        if "color_filter" in row_data:
            ids = row_data["color_filter"].split(",")
            ids = filter(bool, ids)
            return_list = []
            for each_id in ids:
                each_id = each_id.strip()
                return_list.append(self.colors_filters_map[each_id])
            row_data["color_filter"] = return_list
            row_data["filters"].append({
                "group": "colors",
                "values": return_list
            })

        if "material_filter" in row_data:
            ids = row_data["material_filter"].split(",")
            ids = filter(bool, ids)
            return_list = []
            for each_id in ids:
                each_id = each_id.strip()
                return_list.append(self.material_filters_map[each_id])
            row_data["material_filter"] = return_list
            row_data["filters"].append({
                "group": "material",
                "values": return_list
            })

        if "pattern_filter" in row_data:
            ids = row_data["pattern_filter"].split(",")
            ids = filter(bool, ids)
            return_list = []
            for each_id in ids:
                each_id = each_id.strip()
                return_list.append(self.pattern_filters_map[each_id])
            row_data["pattern_filter"] = return_list
            row_data["filters"].append({
                "group": "pattern",
                "values": return_list
            })

    def skip_skuid(self, skuid, skip_list):
        return skuid in skip_list

    def get_description(self, material):
        return self.material_description[material]

    def get_filter_map(self, sheet_name):
        map_dict = {}
        map_sheet = self.workbook.sheet_by_name(sheet_name)
        for row in range(1, map_sheet.nrows):
            key = map_sheet.cell(row, 0).value
            if sheet_name not in ["MATERIAL_DESCRIPTION", "MAPPING_NAMES"]:
                key = str(int(key))
            map_dict[key] = map_sheet.cell(row, 1).value
        return map_dict

    def _initialize_data(self):
        folder_path = self.root
        test = self.is_in_debug



        # skip_skus = []
        # skip_list = load_workbook(filename='/home/hema/Desktop/to_remove_skus.xlsx', data_only=True)
        # skip_list_ws = skip_list['read_data']
        # values = "D49:D83"

        # for row in skip_list_ws.iter_rows(values):
        #     for cell in row:
        #         skip_skus.append(cell.value)
        # print skip_skus

        column_key_map = {}
        excel_data_key_value = {}
        wbsheet = self.workbook.sheet_by_name('read_data')
        row = 0

        for col in range(0, wbsheet.ncols):
            column_key_map[col] = KEY_DB_MAP[wbsheet.cell(row, col).value] if wbsheet.cell(row, col).value in KEY_DB_MAP else wbsheet.cell(row, col).value
        for row in range(1, wbsheet.nrows):
            row_data = {}
            for col in range(0, wbsheet.ncols):
                if not wbsheet.cell(row, col).value or wbsheet.cell(row, col).value in KEY_DB_MAP:
                    if column_key_map[col] == "material_filter":
                        row_data[column_key_map[col]] = "0"
                    continue
                else:
                    row_data[column_key_map[col]] = str(int(wbsheet.cell(row, col).value) if str(wbsheet.cell(row, col).value).endswith('.0') else wbsheet.cell(row, col).value)
            if "skuid" in row_data and row_data["skuid"] in self.skuids.keys():
                excel_data_key_value[str(row_data["skuid"])] = row_data

        length = 0

        for file_name in self.skuids.keys():

            if not self.is_fabric:
                image_data, working_image_url, zoom_image_url = self.upload_image(file_name)
                swatch_image_url = False
                swatch_zoom_image_url = ''
            else:
                image_data, working_image_url, zoom_image_url, swatch_image_url, swatch_zoom_image_url = self.upload_image_swatch(file_name)

            # if skip_skuid(file_name, skip_skus):
            #     continue
            row_data = excel_data_key_value[file_name]
            if not image_data:
                self.fail_data["Image Not Found"].append(folder_path + " " + file_name + " " + row_data["book"])
                continue
            if not image_data:
                continue
            if row_data.get("Priority", None):
                image_data["priority"] = row_data["Priority"]
            elif 'brand' in row_data and row_data["brand"] == "Custom":
                image_data["priority"] = 108
            elif 'brand' in row_data and row_data["brand"] == "Dicitex":
                image_data["priority"] = 12
                if 'book' in row_data and row_data['book'] == "Matka Plus":
                    image_data["priority"] = 13
            elif 'brand' in row_data and row_data["brand"] == "K C Fabrics":
                image_data["priority"] = 15
            elif 'brand' in row_data and row_data["brand"] == "Dicitex":
                image_data["priority"] = 14
            elif 'brand' in row_data and row_data["brand"] == "Mahendra Silks":
                image_data["priority"] = 15
            elif 'brand' in row_data and row_data["brand"] == "Mahaveer Silks":
                image_data["priority"] = 15
            elif 'brand' in row_data and row_data["brand"] == "Sutlej":
                image_data["priority"] = 15
            elif 'brand' in row_data and row_data["brand"] == "D'decor":
                image_data["priority"] = 12
            elif 'book' in row_data and row_data['book'] == "China":
                image_data["priority"] = 101
            elif 'brand' in row_data and row_data["brand"] == "D'decor":
                if 'book' in row_data and "Prisma" in row_data['book']:
                    image_data["priority"] = 9
                elif 'book' in row_data and row_data['book'] == "Polka":
                    image_data["priority"] = 8
                elif 'book' in row_data and row_data['book'] == "Gold":
                    image_data["priority"] = 8
                elif 'book' in row_data and row_data['book'] == "Kaya":
                    image_data["priority"] = 13
                else:
                    image_data["priority"] = 8
            row_data["image_data"] = image_data
            if self.product_id:
                row_data["workingImage"] = image_data["url"]

                if self.curtain_type == "curtains" and self.zoom == "zoom":
                    row_data["productImage"] = {
                        "url": working_image_url,
                        "name": image_data["name"] + "_" + str(self.product_id) + "_product_image_zoom",
                        "priority": 11
                    }
                else:
                    row_data["productImage"] = {
                        "url": working_image_url,
                        "name": image_data["name"] + "_" + str(self.product_id) + "_product_image_1",
                        "priority": 10
                    }

                row_data["productId"] = self.product_id
            else:
                row_data["workingImage"] = working_image_url
            row_data["zoomImage"] = zoom_image_url
            row_data["swatchImage"] = swatch_image_url
            row_data["swatchZoomImage"] = swatch_zoom_image_url
            row_data["vendor"] = "CustomFurnish"
            repeat_upload = 0
            if row_data["type"] in ["curtains", "Curtains", "sheer", "Sheer", "sheers", "Sheers", "Curtain",
                                    "curtain", "Top/bottom", "All", "all", "Top/Bottom"]:

                if self.curtain_type == "shades":
                    row_data["option"] = 5
                else:
                    row_data["option"] = 1

            elif row_data["type"] in ["Top/bottom", "All", "all", "Top/Bottom"]:
                repeat_upload = 1

            if self.curtain_type == "shades":
                row_data["type"] = "Shade Fabric"
            else:
                row_data["type"] = "Curtain Cloth"

            row_data["displayName"] = self.names_dict[row_data["book"]] + " "
            row_data["displayName"] += str(row_data["sr.no"]) if "sr.no" in row_data else ""
            if "shade" in row_data:
                row_data["displayName"] += "-Shade " + str(row_data["shade"])
            row_data["price_filter"] = []
            row_data["price"] = row_data["price"].strip("/-")
            self.rephrase_filters(row_data)
            if ("color_filter" not in row_data) or ("material_filter" not in row_data) or (
                        "pattern_filter" not in row_data):
                self.fail_data["filter fail"].append({"skuid": row_data["skuid"], "product_name": self.product_name})
                continue
            if row_data.get("Seamless", None) == 'no':
                self.fail_data["No Seamless"].append({"skuid": row_data["skuid"], "product_name": self.product_name})
                continue
            if not "setCategory" in row_data:
                self.fail_data["No Category"].append({"skuid": row_data["skuid"], "product_name": self.product_name})
                continue
            if row_data["price"] == "N/A":
                self.fail_data["No Price"].append({"skuid": row_data["skuid"], "product_name": self.product_name})
                continue
            row_data["description"] = self.get_description(row_data["material_filter"][0])
            # sku_id = row_data['skuid']
            # if sku_id in all_sku_ids:
            #     row_data["isActive"] = True
            # else:
            #     row_data["isActive"] = False
            row_data["isActive"] = True

            if swatch_image_url and self.is_fabric:
                row_data["isSwatch"] = True
            else:
                row_data["isSwatch"] = False

            length += 1
            if not test:
                if repeat_upload == 0:
                    resp = requests.post(self.constant.upload_url, json=row_data, headers={"contentType": "application/json"})
                    if resp.status_code != 200:
                        self.fail_data["Upload Failed"].append( {"skuid": row_data["skuid"], "product_name": self.product_name})
                        # raise Exception("upload failed")

                else:
                    while repeat_upload:
                        row_data["option"] = repeat_upload
                        repeat_upload -= 1
                        resp = requests.post(self.constant.upload_url, json=row_data, headers={"contentType": "application/json"})

                        if resp.status_code != 200:
                            self.fail_data["Upload Failed"].append( {"skuid": row_data["skuid"], "product_name": self.product_name})
                            # raise Exception("upload failed")

        return length

    def upload_image_swatch(self, file):
        root=self.root

        new_root_for_swatch = self.create_new_root("1000X500")
        swatch_image_url = self.create_url(new_root_for_swatch, file, "b", False)

        new_root_for_swatch_zoom = self.create_new_root("2000X1000")
        swatch_zoom_image_url = self.create_url(new_root_for_swatch_zoom, file, "b", False)

        working_image_url = swatch_image_url
        data = {
            "url": swatch_image_url,
            "name": file.split(".JPG")[0].split(".jpg")[0],
            "priority": 1
        }
        zoom_image_url = swatch_image_url

        if swatch_image_url and swatch_zoom_image_url:
            return data, working_image_url, zoom_image_url, swatch_image_url, swatch_zoom_image_url
        else:
            return None, None, None, None, None