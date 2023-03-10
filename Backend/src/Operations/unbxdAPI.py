import json
import requests

class UnbxdAPI:

    def __init__(self):
        
        self.url = "https://search.unbxd.io/fb853e3332f2645fac9d71dc63e09ec1/demo-unbxd700181503576558/search?"
        

    """
        Connect to the unbxdAPI
        Args: URL to connect to
        Returns: list
                 first element is the total number of products 
                 Second element is a list of products
    """

    def fetch_data_from_API(self, final_url):
        unbxd_val = requests.get(final_url).content
        unbxd_val = json.loads(unbxd_val)
        result = []
        for product in unbxd_val['response']['products']:
            result.append({'uniqueId': product['uniqueId'], 'title': product['title'], 'productDescription': product['productDescription'], 'price': product['price'], 'productImage': product['productImage']})

        return [unbxd_val['response']['numberOfProducts'], result]

    