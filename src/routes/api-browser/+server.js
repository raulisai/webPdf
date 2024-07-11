import puppeteer from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	// Regex para extraer el dominio
	function getDomain(url) {
		const domainPattern = /^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i;
		const match = url.match(domainPattern);
		return match ? match[1] : null;
	}

	// Crear directorio si no existe
	const pdfDir = path.join('static', 'pdf');
	if (!fs.existsSync(pdfDir)) {
		fs.mkdirSync(pdfDir, { recursive: true });
	}
	//validar link
	function VlidateLink(url, dominio) {
		if (!url) {
			return false;
		}
		const pattern = /^(?:https?:\/\/)?(?:www\.)?([^\/:]+)/i;
		const match = url.match(pattern);
		const domainGet = match ? match[1] : null;
		return domainGet === dominio ? true : false;
	}

	// Función para eliminar archivos PDF
	function deletePDFs(pdfPaths) {
		pdfPaths.forEach((pdfPath) => {
			fs.unlink(pdfPath, (err) => {
				if (err) {
					console.error(`Error deleting file ${pdfPath}:`, err);
				} else {
					console.log(`File ${pdfPath} deleted successfully.`);
				}
			});
		});
	}
	// Lanzar Puppeteer
	const browser = await puppeteer.launch({
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
		headless: true
	});
	const page = await browser.newPage();
	//Inicializar pdf libreri
	const mergedPdf = await PDFDocument.create();

	// Utiliza la URL pasada como parámetro query o una por defecto
	const urlweb = url.searchParams.get('url') || 'https://example.com';

	const domain = getDomain(urlweb);
	// Navega a la URL especificada
	await page.goto(urlweb, { waitUntil: 'networkidle2' });
	await page.pdf({ path: `${pdfDir}/page_1.pdf`, format: 'A4', printBackground: true });
	// Extraer todo el texto visible de la página

	// Extraer los enlaces
	const getlinks = await page.evaluate(() => {
		const anchors = Array.from(document.querySelectorAll('a'));
		return anchors.map((anchor) => anchor.href);
	});
	getlinks.push(urlweb);

	//pasar todas la paginas a pdf
	let index = 2;
	const pdfPaths = [`${pdfDir}/page_1.pdf`];
	for (const link of getlinks) {
		console.log('link ' + link);
		console.log(VlidateLink(link, domain));
		if (VlidateLink(link, domain) == true) {

			try {await page.goto(link, { waitUntil: 'networkidle2' });
			const pdfPath = `${pdfDir}/page_${index}.pdf`;
			await page.pdf({
				path: pdfPath,
				format: 'A4',
				printBackground: true
			});
			pdfPaths.push(pdfPath);
			//unificacion de pdf
			const pdfBytes = fs.readFileSync(`./static/pdf/page_${index}.pdf`);
			const pdfDoc = await PDFDocument.load(pdfBytes);
			const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
			copiedPages.forEach((page) => mergedPdf.addPage(page));
			index++;}
			catch (error) {
                console.log(error);
            }
			
		}
	}

	//unificar el pdf para dejarlo cargado en el server
	const mergedPdfBytes = await mergedPdf.save();
	const pdfUrl = `./static/pdf/${domain}.pdf`;
	await fs.writeFileSync(pdfUrl, mergedPdfBytes);

	// Eliminar archivos PDF individuales
	deletePDFs(pdfPaths);
	// Cierra el navegador
	await browser.close();
	// create a JSON Response using a header we received
	return json({
		// retrieve a specific header
		linksPdf: pdfUrl
	});
}
