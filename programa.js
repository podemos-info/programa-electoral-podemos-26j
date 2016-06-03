// Módulos
var fs = require('fs') // IO ficheros
  , parser = require('csv-parse') // carga CSV en array
  , slug = require('slug') // genera slug
  , _ = require ('lodash') // funciones manipulación de colecciones
  , ejs = require ('ejs') // motor de plantillas
  , marked = require ('marked') // renderiza markdown
  , html2text = require('html-to-text') //convierte html a texto formateado
  , minify = require('html-minifier').minify; // reducir html
var locales = ['es', 'en', 'ca', 'ast', 'eu', 'gl'];
var i18n = new (require('i18n-2'))({
	locales: locales
});

locales.forEach(function(idioma) {

	i18n.setLocale(idioma);

	// CONFIGURACIÓN
	var FICH_DATA = __dirname + '/data/programa_'+idioma+'.csv';
	var DELIMITER = '\t';
	var PLANTILLA = __dirname + '/plantilla-wp.ejs';
	var PLANTILLA_FB = __dirname + '/plantilla-fb-share.ejs';
	var URL_BASE = "http://lasonrisadeunpais.es";

	var etiquetas = require(__dirname + '/data/etiquetas.json');
	//añadimos slugs
	etiquetas.forEach(function(etiqueta) {
		etiqueta["slug"] = slug(etiqueta.nombre).toLowerCase();
	});

	function dame_etiquetas(num_medida) {
		var categorias = [];
		etiquetas.forEach(function(etiqueta) {
			if (etiqueta.medidas.indexOf(num_medida)>=0) categorias.push(etiqueta);
		});
		return categorias;
	}
	// MAIN
	// Leemos el fichero con las medidas
	parser(fs.readFileSync(FICH_DATA, "utf8"), 
	{comment: '#', delimiter: DELIMITER, quote: '"'}, 
	function(err, medidas_csv) {
		if (err) return;
		var medidas = [];
		var total_medidas = medidas_csv.length;
		for (var i=1; i<total_medidas; i++) {
			var num = parseInt(medidas_csv[i][0]);
			if (num) {
				var descripcion = (medidas_csv[i][3].indexOf('</') == -1)?marked(medidas_csv[i][3]):medidas_csv[i][3];
				var medida = {
					num: num,
					eje: (medidas_csv[i][1])?medidas_csv[i][1]:"",
					titulo: (medidas_csv[i][2])?medidas_csv[i][2]:"",
					//descripcion: marked(medidas_csv[i][3]),
					descripcion: descripcion,
					descripcion_text: html2text.fromString(descripcion),
					etiquetas: dame_etiquetas(num)
				};
				medidas.push(medida);
			}
		}
		var ejes = _.uniq(_.pluck(medidas, 'eje'));
		//ejes = _.zipObject(ejes, [30, 40]);
		ejes = _.map (ejes, function(eje) {
			return {
				//nombre: i18n.__(eje),
                nombre: eje,
				slug: slug(eje).toLowerCase()
			};
		});
		var pagina = ejs.render(fs.readFileSync(PLANTILLA, "utf8"), {
			url_base: URL_BASE,
			medidas: medidas, 
			etiquetas: etiquetas, 
			ejes: ejes, 
			i18n: i18n, 
			idioma: idioma
		});
		fs.writeFileSync(__dirname+'/web/programa_'+idioma+'.html', pagina);
		fs.writeFileSync(__dirname+'/web/programa_'+idioma+'.min.html', minify(pagina, { 
			collapseWhitespace: true, 
			removeAttributeQuotes: true }));
		_.each (medidas, function(medida) {
			pagina = ejs.render(fs.readFileSync(PLANTILLA_FB, "utf8"), {
				url_base: URL_BASE,
				medida: medida, 
				i18n: i18n, 
				idioma: idioma
			});
			fs.writeFileSync(__dirname+'/web/fb-share/programa/'+idioma+'/'+medida.num+'.html', pagina);
		});
		console.log(idioma);

	});

});

