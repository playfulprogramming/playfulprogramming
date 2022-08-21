---
{
	title: "TypeScript Intermediates - Type Generics",
	description: 'An introduction to the type generic functionality in TypeScript',
	published: '2019-09-26T05:12:03.284Z',
	authors: ['crutchcorn'],
	tags: ['typescript'],
	attached: [],
	license: 'cc-by-nc-sa-4'
}
---

Mientras trabajas en varios proyectos, puedes encontrarte con una sintaxis de aspecto extraño en el código base: `<>`. No, no, no es JSX, estamos hablando por supuesto de tipos genéricos. Aparecerán junto a las llamadas a funciones (`callFn<T>()`), tipos de TypeScript (`Array<any>`), y más.

_Los tipos genéricos son una forma de manejar tipos abstractos en tu función._ **Actúan como una variable para los tipos en el sentido de que contienen información sobre la forma en que funcionarán tus tipos.** Son muy poderosos por derecho propio, y su uso no se limita a TypeScript. Verás muchos de estos conceptos aplicados bajo terminologías muy similares en varios lenguajes. Sin embargo, basta con esto. ¡Vamos a sumergirnos en cómo usarlos! 🏊

# El problema {#generico-usecase-setup}

Los tipos genéricos — en el nivel más alto — _permiten aceptar datos arbitrarios en lugar de una tipificación estricta, lo que hace posible ampliar el alcance de un tipo_.

Por ejemplo, ¿qué pasaría si quisieras hacer una función que tomara un argumento de `returnProp` y devolviera el propio valor de `returnProp` ([el nombre formal para una función como ésta es una **función de identidad**](https://en.wikipedia.org/wiki/Identity_function))? Sin genéricos, proporcionar una tipificación para una función como ésta podría ser difícil.

Mira la siguiente implementación y considere sus limitaciones:

```typescript
function returnProp(returnProp: string): string {
	return returnProp;
}

returnProp('Test'); // ✅ Esto esta bien
returnProp(4); // ❌ Esto falla porque `4` no es un string
```

En este caso, queremos asegurarnos de que todos los tipos de entrada posibles estén disponibles para el tipo prop. Echemos un vistazo a algunas soluciones potenciales, con sus diversos pros y contras, y veamos si podemos encontrar una solución que se ajuste a los requisitos para proporcionar tipado a una función como ésta.

## Solución potencial 1: Unions {#generic-usecase-setup-union-solution}

Una posible solución a este problema podrían ser las uniones de TypeScript. _Las uniones nos permiten definir una condición `or` para nuestros tipos_. Como queremos permitir varios tipos para las entradas y salidas, ¡quizás eso pueda ayudarnos!

Usando este método, si quisiéramos aceptar números, podríamos añadirlos como una unión:

```typescript
function returnProp(returnProp: string | number): string | number {
	return returnProp;
}

returnProp('Test'); // ✅ Esto esta bien
const shouldBeNumber = returnProp(4); // ✅ No mostrará errores ahora
```

Sin embargo, las uniones tienen algunas limitaciones. Verás que esto no da el ejemplo que podrías querer:

```typescript
// ❌ esto producirá un error
// > El operador '+' no puede aplicarse a los tipos '4' y 'string | number'.
const newNumber = shouldBeNumber + 4;
```

La razón por la que la operación `shouldBeNumber + 4` produce este error es porque le has dicho a TypeScript que `shouldBeNumber` es o bien un número **o** una cadena haciendo que la salida esté explícitamente tipada como una unión. Como resultado, TypeScript es incapaz de hacer la suma entre un número y una cadena (que es uno de los valores potenciales) y por lo tanto arroja un error.

### Soluciones potenciales Descargo de responsabilidad {#silly-examples-disclaimer}

> Nota del autor:
>
> Si estuvieras usando uniones en tus definiciones de propiedades y dejaras tu tipo de retorno en blanco, TypeScript sería capaz de inferir cuál debería ser el tipo de retorno sin problemas.
>
> Dicho esto, estamos tratando de construir sobre los conceptos, por lo que estamos tratando de proporcionar algunos ejemplos de donde esto podría ser utilizado y lo que hace. También hay instancias, como los archivos de definición de tipos, donde esta inferencia podría no estar disponible para un autor de tipos, así como otras limitaciones con este método que veremos más adelante.

## Solución potencial 2: Sobrecarga de funciones {#generic-usecase-setup-overloading-solution}

Para evitar los problemas de devolver explícitamente una unión, usted _PODRÍA_ utilizar la sobrecarga de funciones para proporcionar los tipos de retorno adecuados:

```typescript
function returnProp(returnProp: number): number;
function returnProp(returnProp: string): string;
// Aunque esto parece repetitivo, TS lo requiere.
// De lo contrario, se quejará:
// Esta sobrecarga no es compatible con su firma de implementación.
function returnProp(returnProp: string | number): string | number {
	return returnProp;
}
```

Dicho esto, además de tener una odiosa información duplicada del tipo , este método también tiene sus limitaciones.

Por ejemplo, si quisiéramos pasar un objeto de algún tipo (como `{}`, un simple objeto vacío), no sería válido:

```typescript
returnProp({}) // El argumento de tipo '{}' no es asignable a un parámetro de tipo 'string'.
```

Esto puede parecer obvio a partir de los tipos, pero _lo ideal es que queramos que `returnProp` acepte CUALQUIER tipo porque **no estamos usando ninguna operación que requiera conocer el tipo**._ (nada de sumas o restas, que requieran un número; nada de concatenación de cadenas que pueda restringir el paso de un objeto).

## Solución potencial 3: Any {#generic-usecase-setup-any-solution}

Por supuesto, podemos utilizar el tipo `any` para forzar cualquier tipo de entrada y retorno. (¡Dios sabe que he tenido mi parte justa de frustraciones que terminaron con unos cuantos `any`s en mi código base!)

Aunque esto permitiría cualquier tipo de entrada, también estaríamos perdiendo cualquier información de tipo entre la entrada y la salida. Como resultado, nuestros tipos serían demasiado flojos en el tipo de retorno:

```typescript
function returnSelf(returnProp: any): any {
	return returnProp;
}

const returnedObject = returnSelf({objProperty: 12}); // Esto ahora funciona! 🎉

returnedObject.test(); // esto no retorna un error pero debería 🙁
returnedObject.objProperty; // Esto tambien (correctamente) no arroja un error, pero TS no sabrá que es un número ☹️
```

# La Solución Real {#generics-intro}

¿Cuál es la respuesta? ¿Cómo podemos obtener datos de tipo preservado tanto en la entrada como en la salida?

La solución es... Bueno, seguro que has leído el título

_Los tipo genéricos nos permiten almacenar datos de tipo suelto en una **variable de tipo**_. Una variable de tipo es _un tipo único de variable que no está expuesta a JavaScript, sino que es manejada por TypeScript para proporcionar los tipo de datos esperados_. Por ejemplo, el ejemplo anterior podría reescribirse como:

```typescript
function returnSelf<T>(returnProp: T): T {
	return returnProp;
}
```

En este ejemplo, estamos definiendo una variable de tipo `T`, y luego le decimos a TS que tanto la propiedad como el tipo de retorno deben ser del mismo tipo.

Esto significa que se puede utilizar la función así:

```typescript
const numberVar = returnSelf(2); // T en este caso es `2`, por lo que es similar a escribir `const numberVal: 2 = 2;`

// Igualmente, este objeto se devuelve ahora como si se acabara de colocar en la const
const returnedObject = returnSelf({objProperty: 12});

// Esto fallará, como se esperaba
returnedObject.test();
// Esto existirá, y TS lo conocerá como un número
returnedObject.objProperty;
```

> Nota del autor:
>
> La variable de tipo no necesita llamarse `T`. De hecho, mientras que parece ser un lugar común para la comunidad el uso de nombres de variables de tipo de una sola letra (a menudo debido a la longitud y la complejidad de las tipificaciones), hay muchas razones por las que se deben utilizar nombres de tipo más explícitos.
>
> Recuerde, las variables de tipo son como otras variables en el sentido de que necesita mantenerlas y entender lo que están haciendo en su código.

# Está bien, ¿pero por qué? {#logger-example}

¿Por qué podríamos querer hacer esto? [Devolver un elemento como sí mismo en una función de identidad](#generic-usecase-setup) está bueno, pero no es muy útil en su estado actual. Dicho esto, hay **muchos** usos para los genéricos en las bases de código del mundo real.

Por ejemplo, digamos que tenemos el siguiente código JavaScript que queremos usar como logger:

```javascript
const util = require('util'),
	fs = require('fs');

// Hacer que el `writeFile` devuelva una promesa en lugar de tener que usar un callback
const writeFileAsync = util.promisify(fs.writeFile);

/**
 * Las funciones asíncronas nos permiten usar `await` en promesas en el cuerpo de la función, ponerlas dentro de un try/catch, y
 * devolverán su propia promesa envuelta en el valor `return`.
 */
async function logTheValue(item) {
	const jsonString = JSON.stringify(item, null, 2);

	let err = undefined;

	try {
		// Intenta escribir un nuevo archivo de registro. Si esto falla, guarda el error en la variable `err`.
		await writeFileAsync(`/logs/${Date.now()}`, jsonString);
	// Captura cualquier error y lo guarda como la variable `e` para asignarlo a `err` más tarde
	} catch (e) {
		err = e;
	}

	return {
		loggedValue: jsonString,
		original: item,
		// Si no hay error, devuelve `undefined` aquí
		err: err
	}
}
```

Si quisiéramos tipar la función `logTheValue`, querríamos asegurarnos de utilizar un tipo genérico para el parámetro de entrada `item`. Haciendo esto, podríamos usar ese mismo genérico para el prop de retorno de `loggedValue` para asegurar que ambos tienen la misma tipificación. Para ello, podríamos hacerlo inline:

```typescript
// Como esta es una función `async`, queremos envolver el valor del tipo devuelto en una Promise
async function logTheValue<ItemT>(item: ItemT): Promise<{loggedValue: string, original: ItemT, err: Error | undefined}> {
	// ... Cuerpo de la función aqui
}
```

Con estas características, somos capaces de utilizar gran parte de la funcionalidad de los genéricos.

Sin embargo, sé que no he respondido para qué sirve realmente el `<>`. Bueno, al igual que las variables de tipo, también existe la posibilidad de pasar tipos como "argumentos de tipo" cuando los genéricos se aplican a una función.

Un ejemplo de esto sería una sintaxis como esta:

```typescript
logTheValue<number>(3);
```

# Non-Function Generics {#non-function-generics}

Como has visto antes con la interfaz `LogTheValueReturnType` - las funciones no son las únicas con genéricos. Además de usarlos dentro de las funciones e interfaces, también puedes usarlos en las clases.

Las clases con genéricos pueden ser especialmente útiles para estructuras de datos como ésta:

```typescript
// DataType puede ser una cadena codificada en base64, un buffer o un IntArray
class ImageType<DataType> {
	data: DataType;
	height: number;
	width: number;

	constructor(data: DataType, height: number, width: number) {
		this.data = data;
		this.height = height;
		this.width = width
	};
}

function handleImageBuffer(img: ImageType<Buffer>) {}
```

Los tipos genéricos en las clases se pueden utilizar como argumento de método y tipos de propiedad por igual.

También existe la posibilidad de utilizar genéricos dentro de las definiciones de `tipo`:

```typescript
interface ImageType<DataType> {
	data: DataType;
	height: number;
	width: number;	
}

interface ImageConvertMethods<DataType> {
	// Esta es la tipificación de un método. Tomará una prop del tipo genérico y devolverá el tipo genérico
	toPNG: (data: DataType) => DataType;
	toJPG: (data: DataType) => DataType;
}


type ImageTypeWithConvertMethods<DataType> = ImageType<DataType> & ImageConvertMethods<DataType>
```

# De acuerdo, ¿pero por qué? {#polymorphic-functions}

Vaya, parece que no te fías de mi palabra cuando te digo que los genéricos de tipo son útiles. Está bien, supongo; después de todo, la duda mientras se aprende puede llevar a grandes preguntas! 😉 .

Los tipos genéricos nos permiten hacer cosas como proporcionar tipificaciones para **funciones polimórficas**. _Las funciones polimórficas son funciones que pueden aceptar una gran cantidad de tipos diferentes y manejarlos de manera diferente._

> Las funciones polimórficas no son exclusivas de TypeScript; lo aprendido aquí sobre las funciones polimórficas puede aplicarse también a otros lenguajes. También proporcionan una visión del mundo real sobre los usos de los genéricos y cuándo podrían ser utilizados.

Por ejemplo, veamos el código de `toPNG`:

```typescript
function toPNG(data: DataType): DataType {
	if (Buffer.isBuffer(data)) {
		return convertBufferToPNG(data);
	} else if (Array.isArray(data)) {
		const imgBuffer = Buffer.from(data);
		const pngBuffer = convertBufferToPNG(imgBuffer);		
		return Buffer.from(pngBuffer);
	// cadena codificada en base64
	} else if (typeof data === 'string') {
		const imgBuffer = getBufferFromBaseStr(data);
		const pngBuffer = convertBufferToPNG(imgBuffer);
		return bufferToBase64(pngBuffer);	
	} else {
		throw 'toPNG only accepts arrays, buffers, or strings'
	}
}
```

Aunque esta función acepta varios tipos de datos, los maneja de forma diferente bajo el capó. Las funciones que tienen este tipo de comportamiento de "aceptar muchos, manejar cada uno ligeramente diferente" se llaman **Funciones Polimórficas**. Son particularmente útiles en las bibliotecas de utilidades.

# Restringiendo los tipos {#extends-keyword}

Por desgracia, hay un problema con el código anterior: no sabemos qué tipo es `DataType`. ¿Por qué es importante? Bueno, si no es una cadena, un Buffer, o un tipo Array, ¡lanzará un error! Ese no es ciertamente un comportamiento para encontrarse en tiempo de ejecución.

Vamos a arreglar ese tipado:

```typescript
function toPNG<DataType extends (string | Array<number> | Buffer)>(data: DataType): DataType {
	// ...
}
```

En este ejemplo _estamos usando la palabra clave `extends` para imponer algún nivel de restricción de tipo en la definición, por lo demás amplia, de un tipo genérico_. Estamos usando una unión de TypeScript para decir que puede ser cualquiera de esos tipos, y todavía somos capaces de establecer el valor a la variable de tipo `DataType`.

# Expande tus horizontes {#imperative-casting-extends}

También podemos mantener esa restricción amplia de tipos dentro de sí misma. Digamos que tenemos una función que sólo se preocupa si un objeto tiene una propiedad específica:

```typescript
interface TimestampReturn<T> {
	isPast: boolean;
	isFuture: boolean;
	obj: T
}
const checkTimeStamp = <T extends {time: Date}>(obj: T): TimestampReturn<T> => {
	let returnVal: TimestampReturn<T> = {
		isPast: false,
		isFuture: false,
		obj
	}
	
	if (obj.time < Date.now()) {
		returnVal.isPast = true;
	} else {
		returnVal.isFuture = true;
	}
	
	return returnVal;
}

```

En este caso, podemos confiar en el casting implícito de tipos para asegurarnos de que podemos pasar `{time: new Date()}` pero no `{}` como valores para `obj`.

# Conclusión

¡Y eso es todo lo que tengo para los genérics! Sus usos son muy variados, ¡y ahora puedes aplicar tus conocimientos en el código! Esperamos tener más posts sobre TypeScript pronto - tanto más introductorios como avanzados.

¿Preguntas? ¿Opinión? Háblanos en los comentarios de abajo; ¡nos encantaría escucharte!
