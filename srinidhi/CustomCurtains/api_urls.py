from django.conf.urls import patterns, url
from CustomCurtains.views import *
from upload_from_zip import UploadCurtains

urlpatterns = patterns("CustomCurtains.api_urls",
                       url(r'^get-all-curtains', all_curtains, name='allCurtains'),
                       url(r'^get-option-details', get_option_details, name='getOptionDetails'),
                       url(r'^get-curtain-types', get_curtain_types, name='getCurtainTypes'),
                       url(r'^get-hardware', get_hardwares, name='getHardwares'),
                       url(r'^get-lining-information', get_lining_information, name='getLiningInformation'),
                       url(r'^get-cost', get_cost, name='getCost'),
                       url(r'^get-filter-inputs', get_filter_inputs, name='getFilterInputs'),
                       url(r'^get-filter-data', get_filter_data, name='getFilterData'),
                       url(r'^get-search-data', get_search_data, name='getSearchData'),
                       url(r'^get-filter-input-count', get_filter_input_count, name='getFilterInputCount'),
                       url(r'^get-category-id', get_category_id, name='getCategoryId'),
                       url(r'^get-option-id', get_option_id_by_product_type, name='getOptionIdByProductType'),
                       url(r'^add-sample', add_sample, name='addSample'),
                       url(r'^remove-sample', remove_sample, name='removeSample'),
                       url(r'^delete-samples', delete_samples, name='deleteSamples'),
                       url(r'^merge-samples', merge_samples, name='mergeSamples'),
                       url(r'^get-samples', get_samples, name='getSamples'),
                       url(r'^get-delivered-samples', get_delivered_samples, name='getDeliveredSamples'),
                       url(r'^upload-from-excel-zip', UploadCurtains.as_view()),
                       url(r'^curtains-update-parameter$', update_meta_parameter, name='update-parameter'),
                       url(r'^download-data$', download_data, name='downloadData'),

                       url(r'^get-init-info', get_init_info),
                       url(r'^set-data', get_info),
                       url(r'^get-fabric-option-id', get_fabric_option_id),
                       url(r'^get-fabric', get_fabric),
                       url(r'^add-fabric-to-cart', add_fabric_to_cart),
                       url(r'^get-main-search-results', Search.as_view()),
                       )
