from projectcustom.settings import EBS_MODE

__author__ = 'cfit006'


class CURTAINS:
    ORDER_ID_TYPE = {
        'curtain': '1',
        'shade': '5'
    }

    CURTAIN_MAIN_PAIN_IMAGES = {
        '1': 'eyelet.jpg',
        '2': 'flat_panel.png',
        '3': '',
        '4': '',
        '5': '3_fold_pinch_pleat.png',
        '7': 'ripple_fold.png',
        '452': 'flat_roman_shade.png' if EBS_MODE == "TEST" else 'classic_roman_shade.png',
        '453': 'classic_roman_shade.png' if EBS_MODE == "TEST" else 'flat_roman_shade.png',
        '454': 'pleated_roman_shade.png'
    }

    TYPES = {"eyelet": 1,"flat panel" :2,"pinch pleat": 5, "ripple fold": 7}


EMI_PERCENTAGE = 1.1
TAX_RATIO = 1.125


class SHADES_TYPES:
    TEST = {"PLEATED ROMAN SHADE": 454, "FLAT ROMAN SHADE": 452, "CLASSIC ROMAN SHADE": 453}
    PRODUCTION = {"PLEATED ROMAN SHADE": 454, "FLAT ROMAN SHADE": 453, "CLASSIC ROMAN SHADE": 452}


class REPHRASE_FILTERS:
    COLORS_FILTERS_MAP = {"12": "Black/Grey", "13": "Blue/Dark Blue", "14": "Brown/Beige", "15": "Green",
                          "16": "Lavendar/Purple",
                          "17": "Khaki/Natural/Tan", "18": "Orange/Peach", "19": "Pink/Coral",
                          "20": "Red/Burgundy/Maroon",
                          "21": "White/Ivory/Cream/Silver", "22": "Yellow/Gold"}


    PATTERN_FILTERS_MAP = {"1": "Abstract", "2": "Checkered", "3": "Chevron", "4": "Jacquard",
                       "5": "Embroidered", "6": "Floral",
                       "7": "Geometric", "8": "Graphic", "9": "Paisley", "10": "Polka", "11": "Solid",
                       "12": "Stripes",
                       "13": "Trellis", "14": "Net/Sheer", "15": "Leaves", "16": "Printed",
                       "17": "Velvet"}
    MATERIAL_FILTERS_MAP = {"7": "PolyCotton", "2": "Chenile", "3": "Cotton", "14": "PolyViscose",
                        "8": "Polyester",
                        "5": "Cotton Linen", "15": "PolySpun", "13": "Viscose", "16": "CottonViscose",
                        "11": "Silk",
                        "6": "Linen", "17": "Polylinen", "18": "LinenViscose", "19": "PU",
                        "20": "nylon",
                        "N/A": "N/A",
                        }

MATERIAL_DESCRIPTION = {
    "Cotton": "Light weight soft affordable fabric that knows how to breathe.",
    "Linen": "Natural fabric lighter and more durable than cotton. Breathable and retains shape.",
    "Polyester": "Man-made cost efficient fabric; light weight, strong, and resistant against wrinkles.",
    "Silk": "Rich, luxurious, and strongest natural fabric. Absorbes moisture well and dries quickly.",
    "Cotton Linen": "Blend of cotton and linen; stronger than cotton and cheaper than linen.",
    "PolyCotton": "Blend of cotton and polyester; highly durable, breathable and wrinkle resistant.",
    "PolySpun": "Man-made fabric created from polyster fibres; hangs well and is breathable like cotton.",
    "Viscose": "Made from wood pulp; gives a luxurious glossy look like silk at a cheaper price.",
    "PolyViscose": "Blend of polyester and viscose; has the durability of polyester and silky texture of viscose.",
    "CottonViscose": "Blend of cotton and viscose, durable, breathable and soft.",
    "Polylinen": "Blend of linen and polyester; easy to care for  and wrinkle free fabric",
    "LinenViscose": "Blend of linen and viscose; durable, glossy, and falls well",
    "nylon":"100% nylon",
    "N/A": "N/A",
}

KEY_DB_MAP = {
    "SKUID": 'skuid',
    "TYPE": "type",
    "BRAND NAME": "brand",
    "BOOK NAME": "book",
    "WEIGHT(gsm)": "gsm",
    "COMPOSITION": "material",
    "SR.NO": "sr.no",
    "SHADE": "shade",
    "F.WIDTH(Cms)": "width",
    "RUBS": "rubs",
    "Horiz. REPEAT(Cms)": "horizontal_repeat",
    "Verti. REPEAT(Cms)": "vertical_repeat",
    "Quality": "quality",
    "color no": "color_filter",
    "Material": "material_filter",
    "Pattern": "pattern_filter",
    "opacity": "setCategory",
    "MRP Per MTR": "price",
    "Priority": "Priority",
    "Discount": "discount",
    "deliveryTime": "deliveryTime"

}
