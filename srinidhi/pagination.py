import math
from CustomerRelationshipManagement.utils import FilterUtils
from Utils.constants import DEFAULT_NUMBER_OF_ITEMS_IN_PAGINATION, DEFAULT_PAGE_NUMBER, DEFAULT_RECORD_NO, \
    DEFAULT_TOTAL_PAGES, EXCLUDE_FIELD

class PaginationList:
    def __init__(self, Model, request, queryDict, sort, number_of_items_per_page=None):
        self.Model = Model
        self.query = queryDict
        self.sort = sort
        self.items_per_page = number_of_items_per_page
        self.initialiseData(request)

    def initialiseData(self, request):
        self.numberOfItems = int(
            request.get("numberOfItems", self.items_per_page or DEFAULT_NUMBER_OF_ITEMS_IN_PAGINATION))
        self.pageNumber = int(request.get("pageNumber", DEFAULT_PAGE_NUMBER))
        self.totalPages = int(request.get("totalPages", DEFAULT_TOTAL_PAGES))

    def _setSkipAndLimit(self):
        if self.pageNumber > self.totalPages:
            self.pageNumber = self.totalPages
        if self.pageNumber > 0:
            self.recordNo = (self.pageNumber - 1) * self.numberOfItems
        else:
            self.recordNo = 0

    def _query_evaluator(self, raw_query=None):
        if raw_query == None:
            raw_query = self.query
        self.totalLeads = self.Model.objects.raw_query(raw_query).exclude(**{EXCLUDE_FIELD: True}).count()
        if not self.totalPages:
            self.totalPages = int(math.ceil(
                (self.totalLeads) / float(
                    self.numberOfItems)))
        self._setSkipAndLimit()
        data = self.Model.objects.raw_query(raw_query).exclude(**{EXCLUDE_FIELD: True}).order_by(*self.sort)[
               self.recordNo:(self.recordNo + self.numberOfItems)]
        return data

    # def pagination_with_query(self):
    #     pass

    def paginate(self):
        actual_query = self._query_evaluator()
        data = {'data': actual_query, 'recordNo': self.recordNo, "pageNum": self.pageNumber, "search": self.query,
                'numberOfItems': self.numberOfItems, 'totalPages': self.totalPages, 'totalLeads' : self.totalLeads }
        return data

    def all_data(self):
        actual_query = data = self.Model.objects.raw_query(self.query).exclude(**{EXCLUDE_FIELD: True}).order_by(
            *self.sort)
        data = {'data': actual_query}
        return data


def _query_dict(request):
    query_string = dict()
    query_month = dict()
    query_dict = request.GET.dict()

    if query_dict.get('fromDate') or query_dict.get('toDate'):
        date_filters = FilterUtils.generate_date_filter_query(request.GET.get('fromDate'),
                                                            request.GET.get('toDate'),
                                                            'createdAt', get_raw=True)
        query_string.update(date_filters)

    if query_dict.get('showroom'):
        query_string['showroom'] = query_dict.get('showroom')

    if query_dict.get('owner'):
        query_string['owner'] = query_dict.get('owner')

    return query_string, query_month