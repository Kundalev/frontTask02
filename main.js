// FAKE api : https://dummyjson.com/docs

document.addEventListener("DOMContentLoaded", function () {
    const url = "https://dummyjson.com";

    const form = document.getElementById("form");
    // поля:
    const methodElem = form.elements.method;
    const idElem = form.elements.idProduct;
    const titleElem = form.elements.title;
    const descriptionElem = form.elements.description;
    const thumbnailElem = form.elements.thumbnail;
    const imagesElem = form.elements.images;

    let currentMethod = "GET";

    let imagesElems = []

    idElem.disabled = false;
    titleElem.disabled = true;
    descriptionElem.disabled = true;
    thumbnailElem.disabled = true;
    imagesElem.disabled = true;


    function toDataURL(src, callback){
        let image = new Image();
        image.crossOrigin = 'Anonymous';

        image.onload = function(){
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            context.drawImage(this, 0, 0);
            let dataURL = canvas.toDataURL('image/jpeg');
            callback(dataURL);
        };
        image.src = src;
    }


    axios.get(url + '/products')
        .then(function (response) {
            parseContent(response['data']['products']);
        })
        .catch(function (error) {
            console.log(error);
        });

    const parseContent = (data = []) => {
        const content = document.getElementById("content");

        if (data && data.length) {
            content.innerHTML = "";

            data.forEach((item) => {
                const div = document.createElement("div");
                div.classList.add("item");
                div.innerHTML = `
            <div class="title">
                <h3>${item.title}</h3>
            </div>
            <div class="content">`;
                if (item.thumbnail) {
                    div.innerHTML += `<img src="${item.thumbnail}"></img>`;
                }
                div.innerHTML += `<p>${item.description || ""}</p></div>`;

                div.innerHTML += `<div class="price">${item.price || 0}</div><br/>`;
                content.appendChild(div);
            });
        }
    };

    if (form) {
        form.addEventListener("submit", function (evt) {
            evt.preventDefault();
            let arr = imagesElem.files;
            let i = 0
            for (i = 0; i < arr.length; ++i) {
                toDataURL(window.URL.createObjectURL(arr[i]), function(dataURL){
                    imagesElems.push(dataURL);
                })
            }
            console.log(imagesElems)


            switch (currentMethod) {
                case "GET":
                    axios.get(url + '/products/' + idElem.value)
                        .then(function (response) {
                            console.log(response['data'])
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    break
                case "POST":
                    toDataURL(window.URL.createObjectURL(thumbnailElem.files[0]), function(dataURL){

                    axios.post(url + '/products/add', {
                        title: titleElem.value,
                        description: descriptionElem.value,
                        thumbnail: dataURL.toString(),
                        images: imagesElems.toString()
                    })
                        .then(function (response) {
                            console.log(response['data'])
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                    });
                    break
                case "PUT":
                    toDataURL(window.URL.createObjectURL(thumbnailElem.files[0]), function(dataURL) {
                        axios.put(url + '/products/' + idElem.value, {
                            title: titleElem.value,
                            description: descriptionElem.value,
                            thumbnail: dataURL.toString(),
                            images: imagesElems.toString()
                        })
                            .then(function (response) {
                                console.log(response['data'])
                            })
                            .catch(function (error) {
                                console.log(error);
                            })
                    });
                    break
                case "DELETE":
                    axios.delete(url + '/products/' + idElem.value)
                        .then(function (response) {
                            console.log(response['data'])
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                    break
            }
        });
    }

    if (methodElem) {
        methodElem.addEventListener("change", function method() {
            currentMethod = methodElem.value;
            switch (currentMethod) {
                case "GET":
                    idElem.disabled = false;
                    titleElem.disabled = true;
                    descriptionElem.disabled = true;
                    thumbnailElem.disabled = true;
                    imagesElem.disabled = true;
                    break;
                case "POST":
                    idElem.disabled = true;
                    titleElem.disabled = false;
                    descriptionElem.disabled = false;
                    thumbnailElem.disabled = false;
                    imagesElem.disabled = false;
                    break;
                case "PUT":
                    idElem.disabled = false;
                    titleElem.disabled = false;
                    descriptionElem.disabled = false;
                    thumbnailElem.disabled = false;
                    imagesElem.disabled = false;
                    break;
                case "DELETE":
                    idElem.disabled = false;
                    titleElem.disabled = true;
                    descriptionElem.disabled = true;
                    thumbnailElem.disabled = true;
                    imagesElem.disabled = true;
                    break;
            }
        });
    }
});
