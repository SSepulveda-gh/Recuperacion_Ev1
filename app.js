// ******** ENTREGA - Recuperacion Evaluacion 1 - entrega 9-06-2024 23:59 Hrs Plazo maximo******** //

// NOTAS A CONDERAR
// Se debe agregar la ruta que devemos ignorar EJEMPLO secretos.txt
// Debemos agregar a git el .gitignore a commit -> $ git add .gitignore

/** COMANDOS GIT
 $git status               Ver estado actual
 $git add [Ruta a agregar] para actualizar
  $git commit              Para guardar version
 */

/** TERMINO DE NOTAS A CONSIDERAR */
import express from 'express'
import cors from 'cors'  /** Me da ERROR con CORS en UNI.CONFIG.TS, se configura con Cors */
import { scrypt, randomBytes, randomUUID } from 'node:crypto'     /** Importando crypto */

const app = express()

/** Arrays-  CUENTA DEL USUARIO -> Nombre Usuario/Pwd y hash de clave, que esta al final del Hassh ->certamen123 */ 
/** Se defin los Datos del Usuario */
const users = [{
	username: 'admin',
	name: 'Gustavo Alfredo Marín Sáez',
	password: '1b6ce880ac388eb7fcb6bcaf95e20083:341dfbbe86013c940c8e898b437aa82fe575876f2946a2ad744a0c51501c7dfe6d7e5a31c58d2adc7a7dc4b87927594275ca235276accc9f628697a4c00b4e01' // certamen123
}]

const todos = []  // Arrays

app.use(cors()); 
app.use(express.static('public'))

// Su código debe ir aquí...
/** ***************************CODIGO PARTE DE AQUI************************************************* */

app.use(express.json()) // Usando Json

/** Validando Token-1 // Utilizando el Arrays Users */
/** Nuestro Mildware */

const validarToken = (req, res, next) => {
	const encontrar_Token = users.find((e) => e.token === req.headers['x-authorization'])
	if (encontrar_Token === undefined) return res.sendStatus(401)
	next()  // Evitara que el Servidor se caiga innecesariamente
}

//***************************** SALUDO HELLO WORLD**************************************************** */
/** Hello World
Al ingresar debe entregar la cadena “Hello World!”.
●	Ruta: /api
●	Método: GET
●	Content-Type: text/plain
●	Código de Estado con operación correcta: 200 
*/

/*al ingresra a api regresra "Hello word"  , y regresa codigo 200 como exitoso */ 
app.get('/api', (req, res) => {
	res.contentType('text/plain');
	return res.status(200).send('Hello World!')
});

//****************************** ENVIO DE DATOS - LOGIN ****************************/
/** Login */
/** Al ingresar el usuario y contraseña correcta, la api retornará un objeto con el nombre de usuario, 
 el nombre completo y el token de autenticación, que será requerido para las peticiones posteriores.

●	Ruta: /api/login
●	Método: POST   -1
●	Content-Type: application/json 
●	Entrada:
	○	username: string
	○	password: string 

●	Salida:
	○	username: string
	○	name: string
	○	token: string

●	Código de Estado con operación correcta: 200 
●	Código de Estado con operación incorrecta:
	○	400 si la api no recibió username y/o password en el formato correcto
	○	401 si el usuario no existe
	○	401 si el usuario existe y la contraseña es incorrecta 
*/

/** PORT - envio de datos */
/** Validarcion de ingreso o LOGIN USUARIO */

app.post('/api/login', (req, res) => {

	/** Si una de las variables esta vacia regresa codigo 400 */
	if (req.body.username === '' || req.body.password === '') return res.sendStatus(400)
	
	/** Definimos la variable userIdx para el usuario, que valida  si el valor recivido es igual al valor almacenado */
	const userIdx = users.findIndex(e => e.username === req.body.username)

	/** Validamos en valor de userIdx para el usuario, si el valor ingresado es incorrecto codigo 401 */
	if (userIdx === -1) return res.sendStatus(401)

	/** Validamos la contraseña ingresada v/s el hash amacenado que transformamos a exadecimal para la validacion */
	/** Considerar Key del HTML*/ 

	const [salt, key] = users[userIdx].password.split(':')
	const token = randomBytes(48).toString('hex')
	
	/** Utilizando Script */
	/** Usando SALT, un conjunto aleatorio de bytes, 
	 se usa para dificultar el descifrado no autorizado de un mensaje.  */
	/** Considerar Key del HTML*/ 

	scrypt(req.body.password, salt, 64, (err, derivedkey) => {

		if (key !== derivedkey.toString('hex')) return res.sendStatus(401)

		users[userIdx].token = token
		users[userIdx].password  // Evitar Borrar Usuario -> Modificar linea Original-> delete users[userIdx].password
		return res.status(200).send(users[userIdx])
	})

})

/** ***************************** LISTAR *************************** */
/** ************************  GET - 1 ******************** */
/** Listar Ítems.
Debe poder listar todos los ítems previamente creados. 
Estos ítems deben contar con 3 propiedades: “id”, “title” y “completed”.
●	Ruta: /api/todos
●	Método: GET
●	Content-Type: application/json 
●	Salida:
		○	Arreglo de ítemes:
	■	id: string
	■	title: string
	■	completed: boolean
●	Código de estado con operación correcta: 200
*/

app.get('/api/todos', validarToken, (req, res) => {
	return res.status(200).send(todos)
})

/** **************************** ENVIO DE DATOS - CREACION DE ITEM *************************** */
/** *********************** GET - 2 **************************** */
/** Obtener Ítem
Debe poder entregar la información de un ítem individual. Este ítem debe contar con 3 propiedades: 
“id”, “title” y “completed”.

●	Ruta: /api/todos/:id
●	Método: GET
●	ContentType: application/json 
●	Entrada:
	○	id: string (Por parámetro de ruta) 

●	Salida:
	○	id: string
	○	title: string
	○	completed: boolean

●	Código de Estado con operación correcta: 200 
●	Código de Estado con operación incorrecta:
	○	404 si el ítem no existe 
*/


app.get('/api/todos/:id', validarToken, (req, res) => {
	res.contentType('application/json'); // Tipo
	const Regresa_El_Find = todos.find(e => e.id === req.params.id)
	if (Regresa_El_Find === undefined) return res.sendStatus(404)
	return res.status(200).send(elementFind)
})

/** **************************** ENVIO DE DATOS - CREACION DE ITEM *************************** */
/** Creación de Ítem
Debe poder crear un item. Al momento de crear un item, se le debe proporcionar un identificador único. 
Este ítem debe ser creado con la propiedad “completed” con valor “false”.
●	Ruta: /api/todos/
●	Método: POST –2 
●	Content-Type: application/json 
●	Entrada:
	○	title: string 

●	Salida:
	○	id: string
	○	title: string
	○	completed: boolean

●	Código de Estado con operación correcta: 201 ●	Código de Estado con operación incorrecta:
	○	400 si el title no fue enviado correctamente */

/** POST - envio de datos */ 
/** Punto de Cambio 22:04 Hrs */ /** Para borrar */

app.post('/api/todos', validarToken, (req, res) => {
	res.contentType('application/json'); // Se define de tipo JSon

	if (req.body.title === undefined) return res.sendStatus(400)

	const newTdo = {}
	newTdo.id = randomUUID()  // Clave unica
	newTdo.title = req.body.title,
	newTdo.completed = false,
		todos.push(newTdo)
	return res.status(201).send(newTdo)
})


/** *******************************  ACTUALIZAR ***************************** */
/** Actualización de Ítem
Debe poder actualizar un ítem de forma parcial. Luego de la actualización, además debe retornar un objeto que represente el nuevo estado del ítem actualizado.
●	Ruta: /api/todos/:id
●	Método: PUT
●	Content-Type: application/json 
●	Entrada:
	○	id: string (Por parámetro de ruta)
	○	title?: string ○	completed?: boolean 

●	Salida:
	○	id: string
	○	title: string
	○	completed: boolean

●	Código de Estado con operación correcta: 200 
●	Código de Estado con operación incorrecta:
	○	400 si al enviar el title o completed, estos no están en los formatos correctos
	○	404 si el ítem a modificar no existe
*/


/** *PUT -> ACTUALIZAR */
/** Se Realiza Validacion */

app.put('/api/todos/:id', validarToken, (req, res) => {
	res.contentType('application/json'); // Se define de Tipo Json
	if (req.params.id === undefined) return

	/** El método find() devuelve el valor del primer elemento del array 
	 * que cumple la función de prueba proporcionada */
	/** Param -> Son elementos insertados en tus URL para ayudarte a filtrar y organizar el contenido */

	const Regresa_El_Find = todos.find(e => e.id === req.params.id);
	if (Regresa_El_Find === undefined) return res.sendStatus(404)

	if (req.body.title === undefined) return res.sendStatus(404)
	if (req.body.completed === undefined) return res.sendStatus(404)
	if (req.body.title !== undefined) return res.status(200).send(Regresa_El_Find.title = req.body.title)
	if (req.body.completed === true) return res.status(200).send(Regresa_El_Find.completed = true)
	if (req.body.completed === false) return res.status(400).send(Regresa_El_Find.completed = false)
})

/** *******************************  BORRADO ***************************** */
/** Borrado de Ítem
	Debe poder borrar un ítem que se encuentre guardado en memoria. (5 puntos)
●	Ruta: /api/todos/:id
●	Método: DELETE 
●	Entrada
	○	id: string (Por parámetro de ruta) 

●	Código de Estado con operación correcta: 204 
●	Código de Estado con operación incorrecta:
	○	404 en caso que el ítem no exista
*/

//*** DELETE - > BORRADO ****
/** Param - > Son elementos insertados en tus URL para ayudarte a filtrar y organizar el contenido  */
/** El método find() devuelve el valor del primer elemento del array que cumple la función de prueba proporcionada */
/**  const index = findIndex - > que se encuentra en el HTML */
/** El método splice() cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos */

app.delete('/api/todos/:id', validarToken, (req, res) => {
	const tdoIdx = todos.findIndex(e => e.id === req.params.id)

	if (tdoIdx === -1) return res.sendStatus(404)
	todos.splice(tdoIdx, 1)
	return res.status(204).send(todos)

})

// ... hasta aquí ***************************************************************************

export default app