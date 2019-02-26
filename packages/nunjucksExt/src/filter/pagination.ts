import lo = require('lodash');

const pagination = (nunjucksEnv) => {
    nunjucksEnv.addGlobal("pagination", ({
        link, current, count, query, pageKey = "page"
    }) => {
        let formatLink = link;
        lo.forOwn(query, (val, key) => {
            if(key != pageKey){
                formatLink += "&" + key + "=" + val;
            }
        })

        let first = "";
        if(current > 1){
            first = `<li class="page-item">
                <a class="page-link" href="${ formatLink.replace("{page}", 1) }"> &lt;&lt; </a>
            </li>`;
        }
        let last = "";
        if(current < count){
            last = `<li class="page-item">
                <a class="page-link" href="${ formatLink.replace("{page}", count) }"> &gt;&gt; </a>
            </li>`;
        }
        let minPage = Math.max(current - 3, 1);
        let maxPage = Math.min(minPage + 5, count);
        let pages = [];
        for(let i = minPage; i <= maxPage; i++){
            pages.push({page: i, current: i == current});
        }
        let midPage = pages.map(page => {
            if(!page.current){
                return `<li class="page-item">
                    <a class="page-link" href="${ formatLink.replace("{page}", page.page) }">${page.page}</a>
                </li>`;
            }
            else{
                return `<li class="page-item active">
                    <a class="page-link">${page.page}</a>
                </li>`;
            }
        }).join("");

        return `<ul class="pagination">
            ${first}
            ${midPage}
            ${last}
        </ul>`;
    });
};
module.exports = pagination;