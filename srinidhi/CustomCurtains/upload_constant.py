from projectcustom.settings import POPTIONS_HOST_URL, CURTAINS_BK_NAME, EBS_MODE


class CurtainConstants():
    def __init__(self):
            self.AWS_BUCKET_NAME = CURTAINS_BK_NAME
            self.upload_url = POPTIONS_HOST_URL+'optionvalue/add'    ## test
            self.mode = EBS_MODE

    def get_mode(self):
        return self.mode



class CurtainHardwareConstants(object):
    def __init__(self, domain = None):
        if domain == 'test' or domain == 'staging':
            self.AWS_BUCKET_NAME = 'cf-curtains'
            self.upload_url = 'http://54.255.138.112:8016/poptions/product/related/add'
        elif domain == 'prod':
            self.AWS_BUCKET_NAME = 'cf-curtains-prod'
            # self.upload_url = 'http://54.254.132.35:8000/poptions/product/related/add'