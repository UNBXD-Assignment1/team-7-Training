
// Handler for loading the page and fetching data from backend API in case of search operation 
function onLoadSearchQueryHandler(params_dict, page_number, prod_query){
    var product_block=document.getElementById("product_list");
    var final_search_query = `http://127.0.0.1:5002/search/`;
    final_search_query+=prod_query + "?";
    var current_path="search";
    // Append each param to the base url to generate the final url with all the necessary params
    for(const param of params_dict){
        if(param[0]=='q'){
            current_path+="/"+param[1];
            continue
        }
        final_search_query+=`${param[0]}=${encodeURIComponent(param[1])}&`;
    }
    console.log(final_search_query)

    // Render the current path
    var path_div=document.getElementById("current_path");
    path_div.style.display="block";
    path_div.innerHTML+=current_path;

    fetch(final_search_query, {
        method: 'GET',
        mode : 'cors',
        headers: {
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }}).then(response => response.json()).then((data)=>{

            // data is of the form [number_of_products , list_of_products]
            for (const prod of data[1]){
                var tempid=String(prod.uniqueId);
                product_block.innerHTML+=`
                <div class="card" onclick="window.open('Product.html?uid=${tempid}','_blank');">
                    <img id="product_image" src=`+ prod.productImage+`/><br/>
                    <p id="price-p">$ <span id="price">${prod.price}</span></p>
                    <p id="desc">${prod.title.charAt(0).toUpperCase() + prod.title.slice(1)}</p>
                </div> `
            }
            console.log(data[0])
            document.getElementById("loader").style.display='none';
            paginationHandler(data[0], page_number)
        }).catch(err=>{
            window.location="Page500.html"
            // console.log(err)
            
        });
        return;
}


// Handler for loading the page and fetching data from backend API in case of search operation
function onLoadCategoryHandler(params_dict, page_number, cat1_value, cat2_value){
    var product_block=document.getElementById("product_list");
    var final_search_query = `http://127.0.0.1:5002/category/`;
    var current_path="category";
    if (cat2_value == undefined || cat2_value==""){
        final_search_query+=cat1_value+"?";
        current_path="/"+cat1_value;
    }
    else{
        current_path="/"+cat1_value+"/"+cat2_value;
        final_search_query+=cat1_value+"/"+cat2_value+"?";
    }
    var path_div=document.getElementById("current_path");
    path_div.style.display="block";
    path_div.innerHTML+=current_path;

    // Append each param to the base url to generate the final url with all the necessary params
    for(const param of params_dict){
        if(param[0]=='cat1' || param[0]=='cat2'){
            continue;
        }
        final_search_query+=`${param[0]}=${encodeURIComponent(param[1])}&`;
    }
    fetch(final_search_query, {
        method: 'GET',
        mode : 'cors',
        headers: {
        'Access-Control-Allow-Origin':'*',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        }}).then(response => response.json()).then((data)=>{

            // data is of the form [number_of_products , list_of_products]
            for (const prod of data[1]){
                var tempid=String(prod.uniqueId);
                console.log(prod.imageurl)
                product_block.innerHTML+=`
                <div class="card" onclick="window.open('Product.html?catuid=${tempid}','_blank');">
                    <img id="product_image" src=`+ prod.productImage+`/><br/>
                    <p id="price-p">$ <span id="price">${prod.price}</span></p>
                    <p id="desc">${prod.title.charAt(0).toUpperCase() + prod.title.slice(1)}</p>
                </div> `
            }
            document.getElementById("loader").style.display='none';
            paginationHandler(data[0], page_number); //(number_of_products, page_number)
        }).catch(err=>{

            window.location="Page500.html"
            // console.log(err);
        })
}


// Handles enabling and disabling button based on number of products left. Also renders stats like the total number of products and the number of products being displayed
function paginationHandler(number_of_products, page_number){
    
    document.getElementById("pagination-div").style.display='block';
    var whole_pages = Math.floor(number_of_products/10);
    var reminder_page = number_of_products%10;


    //ternary operation => does not work
    // Lower end page number check
    // (page_number=='1')?(document.getElementById("page-left").disabled = true):(document.getElementById("page-left").disabled = false)

    // Higher end page number check
    // (Number(page_number)==whole_pages && Number(reminder_page)==0)?document.getElementById("page-right").disabled = true:((Number(page_number)>whole_pages && Number(reminder_page)!=0)?document.getElementById("page-right").disabled = true:document.getElementById("page-right").disabled = false);

    // Lower end page number check
    if(page_number=='1'){
        document.getElementById("page-left").disabled = true;
    }
    else{
        document.getElementById("page-left").disabled = false;
    }

    // Higer end page number check
    if(Number(page_number)==whole_pages && Number(reminder_page)==0){
        document.getElementById("page-right").disabled = true;
    }
    else if(Number(page_number)>whole_pages && Number(reminder_page)!=0){
        document.getElementById("page-right").disabled = true;
    }
    else{
        document.getElementById("page-right").disabled = false;
    }


    // Invalid page number recognition
    if ((Number(page_number) > whole_pages+1) || Number(page_number) < 1 || isNaN(page_number)){
        window.open("Page404.html", '_self')
    }
    document.getElementById("page-num").innerHTML=page_number;
    document.getElementById("total-products").innerHTML=`Showing ${(page_number*10)-9} - ${((page_number*10)<=number_of_products)?(page_number*10): ((page_number*10)-10+(number_of_products%10))} of ${number_of_products} products`;
    return;
}


// Redirects the page to the next page
function pageButtonHandler(side){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var params_dict = urlParams.entries();
    var search_val = urlParams.get('q');
    var cur_page_num = (urlParams.has('page'))? Number(urlParams.get('page')) : 1;
    var final_search_query = `Base.html?`;

    if(cur_page_num=='NaN'){
        window.location="Page404.html";
    }
    
    for(const param of params_dict){
        if(param[0]=='page'){
            continue;
        }
        else{
            final_search_query+=`${param[0]}=${encodeURIComponent(param[1])}&`;
        }
    }
    if(side == 'left'){
        window.location=`${final_search_query}page=${cur_page_num - 1}`;
    }
    else{
        window.location=`${final_search_query}page=${cur_page_num + 1}`;
    }
}


//Handles sorting functionality by routing the page with the required params
function sortHandler(){
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var params_dict = urlParams.entries();
    var final_search_query=`Base.html?`;
    for(const param of params_dict){
        console.log(param);
        if(param[0]=='sort'){
            continue;
        }
        else if(param[0]=='page'){
            final_search_query+=`${encodeURIComponent(param[0])}=1&`;
        }
        else{
            final_search_query+=`${param[0]}=${encodeURIComponent(param[1])}&`;
        }
    }
    console.log(final_search_query);
    var sort_operation = document.getElementById("sort-button").value;
    window.location=final_search_query+`sort=${sort_operation}`;
}


// Handles loading page. Loads random data in case of no category or search operation performed. Else calls the respective functions in case of category or search operations.
window.onload=function(){
    // alert(document.cookie);
    document.getElementById("loader").style.display='block';
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var params_dict = urlParams.entries();
    var cat1_value = urlParams.get('cat1');
    var cat2_value = urlParams.get('cat2');
    var prod_query = urlParams.get('q');
    var page_number = (urlParams.has('page'))? Number(urlParams.get('page')) : 1;  //required by onLoadSearchQueryHandler()

    if (cat1_value!=null){
        // call for category function since category params are present
        onLoadCategoryHandler(params_dict, page_number, cat1_value, cat2_value);
    }
    else if(prod_query!=null){
        // call for search function since search query param is present
        onLoadSearchQueryHandler(params_dict, page_number, prod_query);
    }
    else{
        // Base call
        window.location=`Base.html?q=*&page=1`;
    }
    
}
