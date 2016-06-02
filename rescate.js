// Módulos
var fs = require('fs') // IO ficheros
  , parser = require('csv-parse') // carga CSV en array
  , slug = require('slug') // genera slug
  , _ = require ('lodash') // funciones manipulación de colecciones
  , ejs = require ('ejs') // motor de plantillas
  , marked = require ('marked') // renderiza markdown
  , minify = require('html-minifier').minify; // reducir html

// CONFIGURACIÓN
var FICH_DATA = __dirname + '/data/rescate.csv';
var DELIMITER = '\t';
var PLANTILLA = __dirname + '/plantilla-wp-rescate.ejs';
var PLANTILLA_FB = __dirname + '/plantilla-fb-share-rescate.ejs';

/*
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
*/
// MAIN
// Leemos el fichero con las medidas
parser(fs.readFileSync(FICH_DATA, "utf8"), 
{comment: '#', delimiter: DELIMITER, quote: '"'}, 
function(err, medidas_csv) {
	if (err) return;
	var medidas = [];
	var total_medidas = medidas_csv.length;
	for (var i=1; i<total_medidas; i++) {
		var num = parseFloat(medidas_csv[i][0]);
		if (num) {
			var medida = {
				num: num,
				eje: (medidas_csv[i][1])?medidas_csv[i][1]:"",
				titulo: (medidas_csv[i][2])?medidas_csv[i][2]:"",
				descripcion: (medidas_csv[i][3])?marked(medidas_csv[i][3]):"",
				descripcion_text: medidas_csv[i][3]
			};
			medidas.push(medida);
		}
	}
	var ejes = _.uniq(_.pluck(medidas, 'eje'));
	//ejes = _.zipObject(ejes, [30, 40]);
	ejes = _.map (ejes, function(eje) {
		return {
			nombre: eje,
			slug: slug(eje).toLowerCase()
		};
	});
	var pagina = ejs.render(fs.readFileSync(PLANTILLA, "utf8"), {medidas: medidas, ejes: ejes});
	fs.writeFileSync(__dirname+'/web/rescate.html', pagina);
	fs.writeFileSync(__dirname+'/web/rescate.min.html', minify(pagina, { 
		collapseWhitespace: true, 
		removeAttributeQuotes: true }));

	_.each (medidas, function(medida) {
		pagina = ejs.render(fs.readFileSync(PLANTILLA_FB, "utf8"), {medida: medida});
		fs.writeFileSync(__dirname+'/web/fb-share/rescate/es/'+medida.num+'.html', pagina);
	});

/*
  filtros por ejes

	_.each(ejes, function(eje){
		var medidas_por_eje = _.filter(medidas, function(medida) {
			return (medida.eje == eje.nombre)
		});
		var pagina = ejs.render(fs.readFileSync(PLANTILLA, "utf8"), {medidas: medidas_por_eje, etiquetas: etiquetas, ejes: ejes});
		fs.writeFileSync(__dirname+'/web/'+eje.slug+'.htm', pagina);
	}); 
*/
});

