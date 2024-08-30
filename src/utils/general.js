import docxtemplater from 'docxtemplater'
import JSZip from 'jszip'
import JSZipUtils from 'jszip-utils'
import { saveAs } from 'file-saver';
import XlsxTemplate from 'xlsx-template'
var fs           = require('fs'),
    path         = require('path'),
    etree        = require('elementtree');

export default {
    install: (Vue) => {
        Vue.prototype.$general = {
            arrayDifference(arrayA, arrayB) {
                (arrayA.length < arrayB.length) && (arrayB = [arrayA, arrayA = arrayB][0]);

                return arrayA.filter((x) => {
                    return arrayB.indexOf(x) < 0;
                });
            },
            formatMilesWithDecimals(valor) {
                var valor = ""+valor
                var bandera, num, numeroFinal, parteDecimal, parteEntera, valor2, valor3;
                num = valor.split('-');
                if (valor.indexOf('-') === -1) {
                    bandera = 'positivo';
                    valor2 = valor;
                } else {
                    bandera = 'negativo';
                    valor2 = num[1];
                }
                if (valor2.indexOf('.') === -1) {
                    valor3 = valor2.split(',');
                    parteEntera = this.formatMiles(valor3[0]);
                    if (valor3[1] === void 0 || valor3[1] === "") {
                        numeroFinal = parteEntera;
                    } else {
                        numeroFinal = parteEntera + ',' + valor3[1];
                    }
                } else {
                    valor3 = valor2.split('.');
                    parteEntera = this.formatMiles(valor3[0]);
                    parteDecimal = valor3[1];
                    numeroFinal = parteEntera + ',' + parteDecimal;
                }
                if (bandera === 'negativo') {
                    numeroFinal = '-' + numeroFinal;
                }
                return numeroFinal;
            },
            formatMiles(valor){
                var num;
                num = valor.split("-");
                if (num[1] !== void 0) {
                    valor = String(num[1]);
                    num = valor.replace(/\./g, "");
                    num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
                    num = num.split("").reverse().join("").replace(/^[\.]/, "");
                    return '-' + num;
                } else {
                    num = valor.replace(/\./g, "");
                    num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
                    num = num.split("").reverse().join("").replace(/^[\.]/, "");
                    return num;
                }
            },
			validaSoloNumero(e) {
				var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
				var charStr = String.fromCharCode(charCode);
				if (!/^[0-9]+$/.test(charStr)) {
					e.preventDefault()
					e.stopPropagation()
				}
			},
			solo_numeros : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var letras = "1234567890";
				var especiales = "8-16-20-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(letras.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}

			},
			solo_numeros_con_punto : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var letras = "1234567890.";
				var especiales = "8-16-20-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(letras.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}

			},
			solo_numeros_con_coma : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var letras = "1234567890,";
				var especiales = "8-16-20-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(letras.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}

			},
			solo_letras : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var letras = "aeiouáéíóúabcdefghijklmnñopqrstuvwxyzAEIOUÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
				var especiales = "8-16-20-32-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(letras.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}

			},
			solo_letras_numeros : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var letras = "aeiouáéíóúabcdefghijklmnñopqrstuvwxyzAEIOUÁÉÍÓÚABCDEFGHIJKLMNÑOPQRSTUVWXYZ1234567890";
				var especiales = "8-16-20-32-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(letras.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}

			},
			validar_rut(rut){
				if(rut.length < 8 && rut.includes('-') === true && rut[rut.length - 1] !== '-'){
					return true
				}else{

					if(rut.includes('-') === true && rut[rut.length - 1] === '-' ){
						return false
					}else{

						if(rut.length >= 8 && rut.includes('-') === false){
							// es un rut valido por el largo de caracteres
							var texto = rut

							var longitud = rut.length - 1

							var dv_escrito = texto.substring(longitud)
							var rut_sin_dv = texto.substring(0, longitud)

							//comienzo a validar el rut con el algoritmo modulo 11
							//https://www.biobiochile.cl/noticias/2016/03/07/para-que-sirve-y-como-se-calcula-el-digito-verificador-de-nuestro-rut.shtml

							var suma_multiplicacion = 0
							var num = [2,3,4,5,6,7,2,3,4,5,6,7,2,3,4,5,6,7]

							//recorro el rut sin dv de izquierda a derecha
							var indice = 0
							for (var i = rut_sin_dv.length - 1; i >= 0; i--) {
								suma_multiplicacion = suma_multiplicacion + (parseInt(rut_sin_dv[i]) * num[indice])

								indice = indice + 1
							};

							var modulo = suma_multiplicacion % 11

							var casi_dv = 11 - modulo
							var dv = casi_dv.toString()

							if(casi_dv === 11){
								dv = '0'
							}
							if(casi_dv === 10){
								dv = 'K'
							}

							if(dv_escrito === dv){
								return true
							}else{
								return false
							}

						}

						if(rut.length >= 8 && rut.includes('-') === true){
							// es un rut valido por el largo de caracteres

							var dv_escrito = rut.split('-')[1]
							var rut_sin_dv = rut.split('-')[0]

							//comienzo a validar el rut con el algoritmo modulo 11
							//https://www.biobiochile.cl/noticias/2016/03/07/para-que-sirve-y-como-se-calcula-el-digito-verificador-de-nuestro-rut.shtml

							var suma_multiplicacion = 0
							var num = [2,3,4,5,6,7,2,3,4,5,6,7,2,3,4,5,6,7]

							//recorro el rut sin dv de izquierda a derecha
							var indice = 0
							for (var i = rut_sin_dv.length - 1; i >= 0; i--) {
								suma_multiplicacion = suma_multiplicacion + (parseInt(rut_sin_dv[i]) * num[indice])

								indice = indice + 1
							};

							var modulo = suma_multiplicacion % 11

							var casi_dv = 11 - modulo
							var dv = casi_dv.toString()

							if(casi_dv === 11){
								dv = '0'
							}
							if(casi_dv === 10){
								dv = 'K'
							}

							if(dv_escrito === dv){
								return true
							}else{
								return false
							}
						}
					}
				}
			},
			validar_solo_rut : function(e){
				var key = e.keyCode || e.which;
				var tecla = String.fromCharCode(key).toLowerCase();
				var permitidos = "1234567890kK";
				var especiales = "8-16-20-80-186";
				var valor = especiales.split('-');
				var tecla_especial = false;

				for(var j in valor){
					if(key == valor[j]){
						tecla_especial = true;
						break;
					}
				}

				var charStr = String.fromCharCode(key)

				if(permitidos.indexOf(charStr)==-1 && !tecla_especial){
					e.preventDefault()
					e.stopPropagation()
				}
			},
			validarEmail(email){
				var emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
				if (emailRegex.test(email)) {
					return true
				} else {
					return false
				}
			},
			formatear_rut(rut){
				let value = rut.replace(/\./g, '').replace('-', '')
  
				if (value.match(/^(\d{2})(\d{3}){2}(\w{1})$/)) {
					value = value.replace(/^(\d{2})(\d{3})(\d{3})(\w{1})$/, '$1.$2.$3-$4')
				}
				else if (value.match(/^(\d)(\d{3}){2}(\w{0,1})$/)) {
					value = value.replace(/^(\d)(\d{3})(\d{3})(\w{0,1})$/, '$1.$2.$3-$4')
				}
				else if (value.match(/^(\d)(\d{3})(\d{0,2})$/)) {
					value = value.replace(/^(\d)(\d{3})(\d{0,2})$/, '$1.$2.$3')
				}
				else if (value.match(/^(\d)(\d{0,2})$/)) {
					value = value.replace(/^(\d)(\d{0,2})$/, '$1.$2')
				}
				value = value

				return value;
			},
			formatear_fecha(fecha){
				const fecha_format = date.formatDate(fecha, 'YYYY-MM-DD')

				return fecha_format
			},
			mostrarMensaje(tipo,timeout, mensaje) {
				this.alert.snackbar = true
				this.alert.context = tipo
				this.alert.timeout = timeout
				this.alert.text = mensaje
			},
			loadFile(url,callback){
				JSZipUtils.getBinaryContent(url,callback);
			},
			formatoWord(nombre_formato,plantilla,datos){
				this.loadFile(plantilla,function(error,content){
					if (error) { throw error };
					var zip = new JSZip(content);
					var doc = new docxtemplater().loadZip(zip)
					//se pasan los datos como objeto a la plantilla para reemplazar las etiquetas
					doc.setData(datos);
					try {
						// renderiza el documento con los nuevos datos
						doc.render()
					}
					catch (error) {
						var e = {
							message: error.message,
							name: error.name,
							stack: error.stack,
							properties: error.properties,
						}
						console.log(JSON.stringify({error: e}));
						// El error lanzado aquí contiene información adicional cuando se registra con JSON.stringify (contiene un objeto de propiedad).
						throw error;
					}
					var out=doc.getZip().generate({
						type:"blob",
						mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
					})
					//Imprime el documento utilizando Data-URI
					saveAs(out,nombre_formato+".docx")
				})
			},
			formatoExcel(nombre_formato,plantilla,datos){
				// Carga un archivo XLSX en la memoria
				this.loadFile(plantilla,function(error,content){
					if (error) { throw error };
					var zip = new JSZip(content);
					// Crear plantilla
					var template = new XlsxTemplate(content);
					// Numero de la hoja donde irán los reemplazos, por defecto sheet 1
					var sheetNumber = 1;
					// Se pasan los datos a la plantilla y se reemplazan los datos del objeto por los de las etiquetas
					template.substitute(sheetNumber, datos);
					var out
					try {
						// renderiza el documento con los nuevos datos
						// obtiene los datos binarios
						out = template.generate({
							type:"blob",
							mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
						}) //Output the document using Data-URI
					}
					catch (error) {
						console.log(JSON.stringify({error: e}));
						// El error lanzado aquí contiene información adicional cuando se registra con JSON.stringify (contiene un objeto de propiedad).
						throw error;
					}
					//Imprime el documento excel con el nombre del formato pasado por parametro
					saveAs(out,nombre_formato+".xlsx")
				})
			},
            setLocalStorage(nombre, objeto){
                let encrypted = CryptoJS.AES.encrypt(JSON.stringify(objeto), process.env.PASS_empresa_STORAGE);
                localStorage.setItem(nombre, encrypted)
            },
            getLocalStorage(nombre){
                let valor = localStorage.getItem(nombre)
                let decrypted = CryptoJS.AES.decrypt(valor, process.env.PASS_empresa_STORAGE);
                return JSON.parse(decrypted)
            }
        }
    }
};

