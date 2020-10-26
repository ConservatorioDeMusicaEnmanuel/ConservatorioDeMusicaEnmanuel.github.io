/**Event Listener para el efecto fadein y fadeout de la barra de navegación y boton de wasap */
var classes = document.querySelector("#classes");
var contact = document.querySelector("footer")
var wtpButton = document.querySelector("#wpButton")
var classesTop;
var footerTop;



var navBarH = document.querySelector("#navBar").clientHeight;
var pusher = document.querySelector("div#pusher");

function pushCarrousell(){
    navBarH = document.querySelector("#navBar").clientHeight;
    pusher.style.height = `${navBarH}px`;

}


/**Event listener ejecutado cuando se hace un cambio en el tamaño de la pantalla,
 * este toma la altura de la barra de navegación cuando está colapsada
 */
$(window).resize(function () {
    navBarH = document.querySelector("#navBar").clientHeight;
    let collapseButton = document.querySelector("#collapseButton");
    if(collapseButton.getAttribute("aria-expanded") == "true"){
        $("#collapseButton").trigger("click");
    }
    pusher.style.height = `${navBarH}px`;
});


window.addEventListener('scroll', () => {

    classesTop = classes.getBoundingClientRect().top;
    footerTop = contact.getBoundingClientRect().top;

    if (classesTop < 100) {
        changeOpacity("#navBar", 0.6);
    } else {
        changeOpacity("#navBar", 1);
    }

    if(footerTop < 400){
        changeOpacity("#wpButton",0);
        wtpButton.style.display = "none"
    }else{
        changeOpacity("#wpButton",1);
        wtpButton.style.display = "block"

    }
})


/**Posiciona la vista en las diferentes secciones */
function positionToView(selector){
    let elementPosition = $(selector).offset().top;
    $(document).scrollTop(elementPosition - navBarH );
}


/**Muestra la infomación de contacto */
function showContactInfo() {

    /**Información de contacto de respaldo, esta si no se pudo hacer la petición AJAX */
    var contactInfoBack = `
    
<div class="row pb-4">
<div class="col-md-2 col-sm-2">
  <img src="styles/images/socialMedia/facebook.svg" style="height:50px; width: 50px;">
</div>
<div class="col-md-9 col-sm-9 align-self-center">
  <a href="https://www.facebook.com/conservatoriodemusicaemmanuel" class="h5">Conservatorio de Música emmanuel
  </a>
</div>
</div>

<div class="row pb-4">
<div class="col-md-2 col-sm-2">
  <img src="styles/images/socialMedia/instagram.svg" style="height:50px; width: 50px;">
</div>
<div class="col-md-9 col-sm-9 align-self-center">
  <a href="https://www.instagram.com/conservatorioemmanuel/" class="h5">Conservatorio de Música emmanuel
  </a>
</div>
</div>

<div class="row pb-4">
<div class="col-md-2 col-sm-2">
  <img src="styles/images/socialMedia/youtube.svg" style="height:50px; width: 50px;">
</div>
<div class="col-md-9 col-sm-9 align-self-center">
  <a href="https://www.youtube.com/channel/UCeb7_8Pyt82kqrXCYIqcH8g" class="h5">Conservatorio emmanuel</a>
</div>
</div>
    
    `;
    //Petición Asíncrona
    $.get("contact.html", {}, (data) => {
        if (data) {
            var contactTag = document.querySelector("#contactInfo");
            contactTag.innerHTML = data;
        } else {
            contactTag.innerHTML = contactInfoBack;
        }
    }).fail((data) => {
        var contactTag = document.querySelector("#contactInfo");
        contactTag.innerHTML = contactInfoBack;
    });
}


/**Cambia la opacidad de un elemento.
 * @param {string} DOMElement Este es un identificador del árbol DOM,
 *  a este elemento se le establecerá la opacidad.
 * 
 * @param {number} value El valor de la opacidad a cambiar.
 * 
 */
function changeOpacity(DOMElement, value) {
    if (DOMElement === '#navBar') {
        setTimeout(function () {
            if (document.querySelector("#collapseButton").getAttribute('aria-expanded') == 'false') {
                document.querySelector(DOMElement).style.opacity = value;

            } else {

                document.querySelector(DOMElement).style.opacity = 1;
            }
        },
            300);

    } else {
        document.querySelector(DOMElement).style.opacity = value;
    }

    ;
}


/**Muestra la ventana modal de los maestros
 * @param {string} tag teacherName Ruta de archivo; Este archivo almecena
 * el contenido a mostrarse en la ventana modal.
 */
function showTeacherModal(teacherName) {
    var title = document.querySelector("#teacherModalTitle");
    var photo = document.querySelector("#teacherModalPhoto");
    var bio = document.querySelector("#teacherModalBio");
    $.get(`teachers/${teacherName}.json`, {}, (data) => {
        if(data){   
            title.innerHTML= `<h1 class="mx-auto d-block">${data.name}</h1>` ;
            photo.innerHTML= `<img src='${data.img}' class="mx-auto d-block p-2 img-fluid">` ;
            bio.innerHTML= `${data.bio}` ;
        }else{

            title.innerHTML= `<h1>Conservatorio de Música Emmanuel</h1>` ;
            photo.innerHTML= `<img src='styles/images/logo.svg' class='img-fluid mx-auto'>` ;
            bio.innerHTML= `<p>No se procesó la información correctamente en nuestro servidor.<br>error: empty data</p>` ;

        }
        var modalBody = document.querySelector("#teachersModalBody");
        $("#teachersModal").modal('show');
        
    }).fail((jqXHR,status,errorName)=>{
        title.innerHTML= `<h1>Conservatorio de Música Emmanuel</h1>` ;
        photo.innerHTML= `<img src='styles/images/logo.svg' class='img-fluid'>` ;
        bio.innerHTML= `<p>No se procesó la información correctamente en nuestro servidor <br> error: ${jqXHR.status} ${errorName}.</p>` ;

        var modalBody = document.querySelector("#teachersModalBody");
        $("#teachersModal").modal('show');
    })
}

/**
 * Administra las acciones de la sección de los cursos en la página.
 */
function CoursesManager() {

    /**
     * Convierte la información de un módulo de un nivel de un curso en un fila de una
     * de una tabla HTML en Bootstrap 4.
     * @param {object} data json que contiene la información del módulo.
     * @return {String} Código HTML que representa una fila de una tabla en Bootstrap 4.
     */
    this.moduleToRow = function (data) {
        var result = "";
        console.group("CoursesManager.moduleToRow");
        if (typeof data === "object") {
            result = "<tr>";

            var first = true;
            for (const key in data) {
                const element = data[key];

                if (first) { /*Si es el primer elemento de la fila, será el header de la misma.*/
                    result += `<th scope="row">${element}</th>`
                    first = false;
                } else {
                    result += `<td>${element}</td>`
                }
            }

            result += "</tr>"
        } else {
            console.error("El parametro recibido no es un objeto.");
        }

        console.groupEnd();
        return result;
    }

    /**
     * Convierte un nivel de un curso en multiples filas para agregar en el cuerpo de una tabla.
     * @param {object} data json que contiene la información del nivel.
     * @return {String} Código HTML que representa múltiples filas y columnas de una tabla en Bootstrap4.
     */
    this.levelToTable = function (data) {
        var result = "";
        console.group("CoursesManager.lavelTotable")
        if (typeof data === "object") {
            result =
                `
            <div class="row">
                <h5>${data.name}</h5><br>
                <table id="courseTable" class="table text-dark table-borderless table-responsive-sm">
                <thead>
                    <tr>
                    <th scope="col">Módulo</th>
                    <th scope="col">Duración</th>
                    <th scope="col">Clases</th>
                    </tr>
                </thead>
                <tbody>
            
            `;

            for (const iterator of data.modules) {
                result += this.moduleToRow(iterator);
            }

            result +=
                `
                </tbody>
                </table>
                </div>
                `;
        } else {

            console.error("El parametro recibido no es un objeto.");
        }
        console.groupEnd();
        return result;
    }

    /**
     * Convierte en una tabla HTML un json con la información del curso. 
     * @param {object} data json con la información del curso.
     * @return {String} Código HTML que representa una tabla en Bootstrap 4.
     */
    this.toTable = function (data) {
        console.group("CoursesManager.toTable");
        var result = "";
        console.log(data);
        for (const iterator of data.levels) {
            result += this.levelToTable(iterator);
        }
        console.groupEnd();
        return result;
    }

    /**
     * Muestra un modal con la información de la clase especificada.
     * @param {String} className Nombre de la clase que se requiere.
     */
    this.showModal = function (className) {
        $.get(`courses/${className}.json`, {}, (data) => {
            console.group("ClassModal");
            console.log("piano dentro");
            console.log(data);


            var modalTitle = document.querySelector("div#coursesModal h5.modal-title");
            var modalBody = document.querySelector("div#coursesModal div.modal-body");

            modalTitle.innerHTML = data.name;

            modalBody.innerHTML =
                `
                <b>Modalidad:</b> Virtual (Mediante plataforma Zoom).<br>
                <b>Requisitos:</b> ${data.requirements ? data.requirements : "Ninguno"}.<br>
                <br>
                <div class=container-fluid>${new CoursesManager().toTable(data)}</div>`;

            $("#coursesModal").modal('show');

            console.groupEnd();
        });

    }
}
/**
 * Animación de las cartas de los cursos.
 */
$(document).ready(function(){
    $('div#courseCard').hover(
        function(){
            $(this).animate({
                marginTop: "-=1%",
            },100);
        },
        
        function(){
            $(this).animate({
                marginTop: "0%",
            },100);
        }
    );
});