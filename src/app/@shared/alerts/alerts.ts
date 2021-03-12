import { EMAIL_PATTERN } from './../../@core/constants/regex';
import Swal from "sweetalert2"

const swalWhitBasicBasicOptions = (title: string, html: string) => Swal.mixin({
    title,
    html,
    focusConfirm: false,
    cancelButtonText: 'Cancelar',
    showCancelButton: true
})

export async function genreFormBasicDialog(title: string, html: string, property: string) {
    return await swalWhitBasicBasicOptions(title, html).fire({
        preConfirm: () => {
            const value = (document.getElementById('name') as HTMLInputElement).value;
            if (value) {
                return value;
            }
            Swal.showValidationMessage('Añade un genero');
            return;
        },
    })
}
export async function userFormBasicDialog(title: string, html: string) {
    return await swalWhitBasicBasicOptions(title, html).fire({
        preConfirm: () => {
            let error = ''
            const name = (document.getElementById('name') as HTMLInputElement).value;
            if (!name) {
                error +='Nombre es obligatorio';
            }
            const lastname = (document.getElementById('lastname') as HTMLInputElement).value;
            if (!lastname) {
                error +='Apellido es obligatorio';
            }
            const email = (document.getElementById('email') as HTMLInputElement).value;
            if (!email) {
                error +='Correo es obligatorio';
            }
            if(!EMAIL_PATTERN.test(email)){
                error +='Email cuenta con caracteres No validos'
            }
            const role = (document.getElementById('role') as HTMLInputElement).value;
            if (error !== '') {
                Swal.showValidationMessage(error);
                return;
            }
            return{
                name,
                lastname,
                email,
                role,
                birthDay: new Date().toISOString()
            };
        },
    })
}

export async function optionsWithDetailsBasic(title: string, html: string, width: number | string, confirmButtonText:string = '<i class="fas fa-edit"></i> Editar', cancelButtonText = '<i class="fas fa-lock"></i> Bloquear') {
    return await Swal.fire({
        title,
        html,
        width: `${ width }px`,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#6c757d',
        confirmButtonText,
        cancelButtonColor: '#dc3545',
        cancelButtonText

    }).then((result) =>{
        if (result.value) {
            console.log('editar')
            return true;
        }else if (result.dismiss.toString()==='cancel') {
            console.log('bloquear');
            return false;
        }
    })
}