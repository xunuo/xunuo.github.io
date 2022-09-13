const puppeteer = require('puppeteer');
const express = require('express');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://accounts.shopify.com/store-login',{
        waitUntil: ['domcontentloaded','networkidle0'],
    });
    // await page.screenshot({path: 'example.png'});
    await page.type('#account_email', 'snow@metaq.live');

    await page.click('[name="commit"]');

    await page.type('#account_password', 'Hello30280~');


    // await page.$eval('#reboot > .block-row > .showForNodes', elem => elem.click());
    await page.waitForTimeout(4000);
    // await page.$eval('#reboot > .block-row > .showForNodes', elem => elem.click());

    // await page.click('[name="commit"]');
    await page.$eval('[name="commit"]', elem => elem.click());

    // await page.waitForTimeout(2000);

    // run js
    // await page.evaluate(() => alert('This message is inside an alert box'));

    // Normalizing the text
    // function getText(pText) {
    //     pText = pText.replace(/\r\n|\r/g, "\n");
    //     pText = pText.replace(/\ +/g, " ");
    //
    //     // Replace &nbsp; with a space
    //     var nbspPattern = new RegExp(String.fromCharCode(160), "g");
    //     return pText.replace(nbspPattern, " ");
    // }
    //
    // // find the link, by going over all links on the page
    // async function findByText(page, pString) {
    //     const ps = await page.$$('p')
    //     for (var i=0; i < ps.length; i++) {
    //         let valueHandle = await ps[i].getProperty('innerText');
    //         let pst = await valueHandle.jsonValue();
    //         const text = getText(pst);
    //         if (pString == text) {
    //             console.log(pString);
    //             console.log(text);
    //             console.log("Found");
    //             return ps[i];
    //         }
    //     }
    //     return null;
    // }

    // await page.waitForTimeout(1000);

    // const shopEnter = await findByText(page, "allmotorstore.myshopify.com");
    // await page.$eval(shopEnter, elem => elem.click());


    await page.goto('https://allmotorstore.myshopify.com/admin/products',{
        waitUntil: ['domcontentloaded','networkidle0'],
    });

    try{
        await page.$eval('[class="user-card__name"]', elem => elem.click());
    }catch(e){
        console.log(e);
    }

    await page.waitForTimeout(5000);

    await page.goto('https://allmotorstore.myshopify.com/admin/products',{
        waitUntil: ['domcontentloaded','networkidle0'],
    });


    // await page.waitForTimeout(10000);

    // RUN JS on Page.
    const changeProductStatus = (statusValue, productId) => {


        page.evaluate((args) => {

            // POST request using fetch()

            const {productId,statusValue} = args;


            fetch('https://allmotorstore.myshopify.com/admin/internal/web/graphql/core?operation=ProductBulkChangeStatus&type=mutation', {

                // Adding method type
                method: "POST",

                // Adding body or contents to send
                body: JSON.stringify({
                    "operationName": "ProductBulkChangeStatus",
                    "variables": {
                        "productIds": ["gid://shopify/Product/" + productId],
                        "status": statusValue
                    },
                    "query": "mutation ProductBulkChangeStatus($query: String, $productIds: [ID!], $status: ProductStatus!, $changeAll: Boolean) {\n  productBulkChangeStatus(\n    search: $query\n    productIds: $productIds\n    status: $status\n    changeAll: $changeAll\n  ) {\n    userErrors {\n      field\n      message\n      __typename\n    }\n    job {\n      id\n      __typename\n    }\n    __typename\n  }\n}\n"
                }),

                // Adding headers to the request
                headers: {
                    "accept": "application/json",
                    "Content-type": "application/json",
                    "x-csrf-token": document.querySelector("[data-serialized-id='csrf-token']").innerText.replace(/"/g,''),
                    "x-shopify-web-force-proxy" : "1"
                }
            })

            // Converting to JSON
            .then(response => response.json())

            // Displaying results to console
            .then(json => console.log(json));

            alert('Changed Product [' + productId + '] to ' + statusValue + '!');

        },{
            statusValue : statusValue,
            productId : productId
        });
    }



    // START RUN JS

    const app = express();
    const port = process.env.PORT || 1234;

    app.get('/ACTIVE/:productId', (req, res) => {
        changeProductStatus('ACTIVE', req.params.productId);
    });

    app.get('/DRAFT/:productId', (req, res) => {
        changeProductStatus('DRAFT', req.params.productId);
    });

    app.listen(8080, () => console.log('Server started. Press Ctrl+C to quit'));


    // Keep Beating / aLive.
    // setInterval(async () => {
    //     await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    // },15000);


    // await page.click(shopEnter);

// https://accounts.shopify.com/select?rid=4945bb68-1d8a-4f44-b2ec-91c0398bcb00

    // await browser.close();
})();
