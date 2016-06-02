// Módulos
var fs = require('fs') // IO ficheros
  , parser = require('csv-parse') // carga CSV en array
  , slug = require('slug') // genera slug
  , _ = require ('lodash') // funciones manipulación de colecciones
  , ejs = require ('ejs') // motor de plantillas
  , minify = require('html-minifier').minify; // reducir html

// CONFIGURACIÓN
var FICH_DATA = __dirname + '/data/programa.csv';
var DELIMITER = '\t';
var PLANTILLA = __dirname + '/plantilla-wp.ejs';

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
			var medida = {
				num: num,
				eje: (medidas_csv[i][1])?medidas_csv[i][1]:"",
				titulo: (medidas_csv[i][2])?medidas_csv[i][2]:"",
				descripcion: (medidas_csv[i][3])?medidas_csv[i][3]:"",
				etiquetas: dame_etiquetas(num)
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
	var pagina = ejs.render(fs.readFileSync(PLANTILLA, "utf8"), {medidas: medidas, etiquetas: etiquetas, ejes: ejes});
	fs.writeFileSync(__dirname+'/web/index.html', pagina);
	fs.writeFileSync(__dirname+'/web/index.min.html', minify(pagina, { 
		collapseWhitespace: true, 
		removeAttributeQuotes: true }));
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

