/**
 * IndexNow URL Submission Script for numerosenletras.org
 * Protocol docs: https://www.indexnow.org/documentation
 */

const HOST = "numerosenletras.org";
const KEY = "f8a92e106c57404db356a693b8214de7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const URLS = [
  `https://${HOST}/`,
  `https://${HOST}/numeros/`,
  `https://${HOST}/cantidad-con-letra/`,
  `https://${HOST}/cantidad-con-letra/mexico/`,
  `https://${HOST}/cantidad-con-letra/colombia/`,
  `https://${HOST}/cantidad-con-letra/peru/`,
  `https://${HOST}/cantidad-con-letra/argentina/`,
  `https://${HOST}/cantidad-con-letra/espana/`,
  `https://${HOST}/como-se-escribe/`,
  `https://${HOST}/fuentes-y-metodologia/`,
  `https://${HOST}/letras-aesthetic/`,
  `https://${HOST}/letras-burbuja/`,
  `https://${HOST}/blog/`,
  `https://${HOST}/sobre-nosotros/`,
  `https://${HOST}/contacto/`,
  `https://${HOST}/privacidad/`,
  `https://${HOST}/terminos/`
];

const args = process.argv.slice(2);
const finalUrls = args.length > 0 ? args : URLS;

async function submitIndexNow() {
  console.log(`Submitting ${finalUrls.length} URLs to IndexNow for ${HOST}...`);
  
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: finalUrls
  };

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 200 || response.status === 202) {
      console.log(`IndexNow submission successful! Status: ${response.status}`);
    } else {
      console.error(`IndexNow submission failed with status: ${response.status} ${response.statusText}`);
      process.exitCode = 1;
    }
  } catch (error) {
    console.error("Failed to submit to IndexNow:", error);
    process.exitCode = 1;
  }
}

submitIndexNow();
