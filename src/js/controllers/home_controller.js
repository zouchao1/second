import home_template from '../views/home.html';

const render=()=>{

    document.querySelector("#root").innerHTML=home_template;
   

}

export default { render }