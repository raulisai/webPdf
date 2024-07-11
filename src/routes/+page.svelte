<script>
	let fileDone = false;
	let inputValue = '';
	let textContent = '';

	function UrlValidator(urlweb) {
		console.log(urlweb);
		let regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
		if (regex.test(urlweb)) {
			return true;
		} else {
			alert('Ingrese una URL valida');
			return false;
		}
	}
	async function getWebToPdf(url) {
		const response = await fetch(`/api-browser?url=${encodeURIComponent(url)}`);
		if (response.ok) {
			textContent = await response.text();
		} else {
			textContent = 'Error al cargar el contenido de texto';
		}
		return textContent;
	}

	async function ConverWebToPdf() {
		//validar url
		let UrlValid = UrlValidator(inputValue);

		//obtencion de todos las subsecciones de la url
		let links = await getWebToPdf(inputValue).then((text) => {
			console.log(text);
		});
	}

	const Dowload = () => {
		if (fileDone == false) {
			alert('No se ha generaldo ningun archivo');
			return 0;
		} else {
		}
	};
</script>

<div class="grid justify-items-center mt-24">
	<div>
		<h1 class="text-xl">Extractor de info. <strong>web to PDF</strong></h1>
	</div>

	<div class="w-[50%] mt-24">
		<input
			class="focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full text-sm leading-6 text-slate-900 placeholder-slate-400 rounded-md py-2 pl-10 ring-1 ring-slate-200 shadow-sm"
			type="text"
			bind:value={inputValue}
			aria-label="Filter projects"
			placeholder="Web URL.."
		/>
	</div>

	<div class=" mt-8">
		<button
			on:click={ConverWebToPdf}
			type="button"
			class="bg-indigo-300 text-white text-sm leading-6 font-medium py-2 px-3 rounded-lg hover:bg-indigo-500"
			>Convert</button
		>
	</div>

	<div class="mt-44">
		<button on:click={Dowload}>
			<img src="./file_Pdf.svg" class="w-32" alt="Img pdf" />
			<h4 class="">Dowload</h4>
		</button>
	</div>
</div>
