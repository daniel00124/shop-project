const signup=()=>{
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch('/signup',{
        method:"post",
        headers:{"content-Type":"application/json"},
        body:JSON.stringify({
            name:name,
            email:email,
            password:password
        })
    }).then(res=>res.json()).then(data=>{
        alert(data.message)
        if(data.message =='signedup'){
            location.href = '/'
        }
    })
}

const signin=()=>{
    const loged = false
    const checkEmail = document.getElementById("checkEmail").value;
    const checkPassword = document.getElementById("checkPassword").value;
    fetch('/signin',{
        method:"get",
        headers:{"content-Type":"application/json"}
    }).then(res=>res.json()).then(data=>{
        data.forEach(val=>{
            if(val.email == checkEmail && val.password == checkPassword){
                sessionStorage.setItem("userName",JSON.stringify(val.name))
                alert(val.name +' loged in')
                location.href = '/products.html'
                loged =true
            }
        })
        if (!loged){alert('email or password are uncorect')}
    })
}
const selectedProducts = []
const createProduct=()=>{
    const serchProduct = document.getElementById("serchProduct").value;
    const selected = document.getElementById("selected").value;
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = '';
    fetch('/products',{
        method:"get",
        headers:{"content-Type":"application/json"}
    }).then(res=>res.json()).then(data=>{
        if(selected == 'by-name'){
            data = data.sort((a, b) => {
                const nameA = a.productName.toUpperCase(); 
                const nameB = b.productName.toUpperCase(); 
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
        }else if(selected == 'by-price'){
            data = data.sort((a, b) => a.price - b.price)
        }
        data.forEach(val=>{
            let isInclud = val.productName.toLowerCase().includes(serchProduct)
            if(serchProduct!='' && isInclud ){
                const div = document.createElement('div')
                const button = document.createElement('button')
                const span = document.createElement('span')
                button.onclick = ()=>{
                    selectedProducts.push(val)
                    console.log(selectedProducts)
                }
                button.innerHTML = val.productName
                span.innerHTML = val.price
                div.append(button)
                div.append(span)
                productsDiv.append(div)
            }
            if(serchProduct==''){
            const div = document.createElement('div')
            const button = document.createElement('button')
            const span = document.createElement('span')
            button.onclick = ()=>{
                selectedProducts.push(val)
                console.log(selectedProducts)
            }
            button.innerHTML = val.productName
            span.innerHTML = val.price
            div.append(button)
            div.append(span)
            productsDiv.append(div)
        }
        })
    })
}
const storCart=()=>{
    sessionStorage.setItem("cart",JSON.stringify(selectedProducts))
    location.href = '/buy.html'
}
const showSelectedProducts= ()=>{
    let cart = JSON.parse(sessionStorage.getItem("cart"))
    const product = document.getElementById("showSelectedProduct");
    let sumPrice = 0
    if (cart) {
        cart.forEach(val => {
            const div = document.createElement('div');
            const p = document.createElement('p');
            const span = document.createElement('span');
            p.innerHTML = val.productName;
            sumPrice+=val.price;
            div.append(p);
            product.append(div);
        });
        let totalPrice= document.getElementById("totalPrice")
        totalPrice.innerHTML = "Total price:"+ sumPrice
    } else {
        product.innerHTML = 'No selected products';
    }
}

const approve=()=>{
    const name = JSON.parse(sessionStorage.getItem("userName"))
    const products = JSON.parse(sessionStorage.getItem("cart"))
    fetch('/buy',{
        method:"post",
        headers:{"content-Type":"application/json"},
        body:JSON.stringify({
            name:name,
            products:products
        })
    }).then(res=>res.json()).then(data=>{
        if(data.message =='approved'){
            alert(data.message)
            location.href = '/'
        }else if(data.message =='no products selected'){
            alert(data.message)
        }
    })
}
