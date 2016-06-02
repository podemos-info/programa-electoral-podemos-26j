# programa-electoral-podemos-26j

Scripts en node.js que generan las páginas estáticas que conforman el programa de PODEMOS para el 26J: http://lasonrisadeunpais.info/programa/

## Scripts

### programa.php

Plugin de wordpress que genera los shortcodes para incrustar las páginas estáticas dentro de un wordpress.

### programa.js

Script que genera a partir de los archivos .csv que se encuentran en data/ una página navegable por idioma (castellano, asturiano, catalán, inglés, euskera y gallego).

Además genera una página para cada medida del programa para poder compartir en redes sociales con los meta adecuados.

### rescate.js

Script que genera a partir del archivo data/rescate.csv la página navegable del Plan de Rescate http://lasonrisadeunpais.es/plan-rescate-ciudadano/

Además genera una página para cada medida del programa para poder compartir en redes sociales con los meta adecuados.

## Directorios

### data/

Directorio con los archivos .csv del Programa y del Plan de Rescate en todos los idiomas. También contiene imágenes y pdfs.

### web/

Directorio que contiene las páginas estáticas que generan los scripts.

## Licencia

AGPL
