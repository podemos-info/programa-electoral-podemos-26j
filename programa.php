<?php

/**
 * @package PROGRAMA
 * @version 0.1
 */

/*
Plugin Name: PROGRAMA
Description: Muestra páginas generadas estáticamente con el programa de Podemos.
Author: joker
Version: 0.2
Author URI: https://github.com/podemos-info/programa-electoral-podemos-26j/
*/

// Plan de Rescate Ciudadano
function fn_rescate($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/rescate.min.html");
}
add_shortcode( 'rescate', 'fn_rescate');

// Programa electoral de PODEMOS
function fn_programa_ca($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_ca.min.html");
}
add_shortcode( 'programa-ca', 'fn_programa_ca');

function fn_programa_es($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_es.min.html");
}
add_shortcode( 'programa-es', 'fn_programa_es');

function fn_programa_ast($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_ast.min.html");
}
add_shortcode( 'programa-ast', 'fn_programa_ast');

function fn_programa_gl($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_gl.min.html");
}
add_shortcode( 'programa-gl', 'fn_programa_gl');

function fn_programa_en($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_en.min.html");
}
add_shortcode( 'programa-en', 'fn_programa_en');

function fn_programa_eu($attrs) {
  return file_get_contents(ABSPATH."wp-content/plugins/programa/web/programa_eu.min.html");
}
add_shortcode( 'programa-eu', 'fn_programa_eu');

