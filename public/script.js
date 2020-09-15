let addPage = document.querySelector('#add-page')
let addLink = document.querySelector('#add-link')
let deletePages = document.querySelectorAll('.delete')
let deleteLinks = document.querySelectorAll(".delete-link");

function api(url, method, data){
    if(!url){
        console.log(`no url provided`)
        return
    }
    method = method || `get`
    data = data || {}
    options = {}

    if(method === "get"){
        fetch(url)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
        })
        .catch((error) => console.log(error));
    }else {
        options = {
            method: method,
            headers: {"Content-Type": "application/json"},
            body: data
        }
        fetch(url, options)
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            location.reload()
            // if(res.success){
            //     window.location.href="/"
            // }
        })
        .catch((error) => console.log(error));
    }
}
if(addPage){
    addPage.addEventListener("submit", (e) => {
    e.preventDefault();
    let form = new FormData(addPage);
    let formData = {};
    form.forEach((value, key) => {
        formData[key] = value;
    });
    let formToSend = JSON.stringify(formData);
    api(`pages`, `post`, formToSend);
    });
    Array.prototype.forEach.call(deletePages, (page) => {
      page.addEventListener("click", (e) => {
        e.preventDefault();
        let id = e.target.id;
        if (confirm("Delete?")) {
          api(`/pages`, `delete`, JSON.stringify({ id: `${id}` }));
        }
      });
    });
}

if(addLink){
    addLink.addEventListener("submit", (e) => {
        e.preventDefault();
        let form = new FormData(addLink);
        let formData = {};
        form.forEach((value, key) => {
            formData[key] = value;
        });
        let formToSend = JSON.stringify(formData);
        console.log(formToSend);
        let url = `../page/link`
        api(url, `post`, formToSend);
    });
    Array.prototype.forEach.call(deleteLinks, (link) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        let id = e.target.id;
        let pageId = e.target.dataset.pageid;
        if (confirm("Delete?")) {
            console.log(pageId, id)
            api(`/page/link`, `delete`, JSON.stringify({ pageid: `${pageId}`, linkname: `${id}` }));
        }
    });
    });
}

