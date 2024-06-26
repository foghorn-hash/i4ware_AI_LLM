import React, {useEffect, useState} from "react";
import "./RegistrationForm.css";
import {API_BASE_URL, API_DEFAULT_LANGUAGE} from "../../constants/apiConstants";
import {Redirect, withRouter} from "react-router-dom";
import {AuthContext} from "./../../contexts/auth.contexts";
import request from "../../utils/Request";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import TextInput, { PassWordInput } from "./../common/TextInput";
import Captcha from "demos-react-captcha";
import "./../../captcha.css";
// ES6 module syntax
import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
  en:{
    email:"Email",
    enteremail:"Enter email",
    newershare:"We'll never share your email with anyone else.",
    password:"Password",
    male:"Male",
    female:"Female",
    account:"Already have an account?",
    register:"Register",
    confirmPassword:"Confirm Password",
    domain:"Domain",
    error:"Unexpected error!",
    gender:"Gender",
    name:"Name",
    success_registeration:"Registration successful and verification email has been sent.",
    selectPrivacyPolicy: "Please Select Privacy Policy.",
    neverShareName: "We'll never share your name with anyone else.",
    neverShareGender: "We'll never share your gender with anyone else.",
    domainInUse: "You need to know right domain that is in use.",
    neverShareDomain: "We'll never share your domain with anyone else.",
    passwordStronglyCrypted: "Password is strongly encrypted and is secure in our database.",
    privacyPolicy: "Privacy Policy",
    dataProcessingAgreement: "Data Processing Agreement",
    agreedOn: "Agreed on",
    and: "and",
    required: "Required",
    register: "Register",
    loginHere: "Login here",
    tooLong: "Too Long!",
    tooShort: "Too Short!",
    invalidEmail: "Invalid email",
    invalidDomain: "Domain is invalid",
    passwordsDontMatch: "Password and Confirm password should be same."
  },
  fi: {
    email:"Sähköposti",
    enteremail:"Syötä sähköpostiosoite",
    newershare:"Enme koskaan jaa sähköpostiosoitettasi muille.",
    password:"Salasana",
    male:"Mies",
    female:"Nainen",
    account:"Minulla on jo tili?",
    register:"Rekisteröidy",
    confirmPassword:"Vahvista salasana",
    domain:"Verkkotunnus",
    error:"Odottamaton virhe!",
    gender:"Sukupuoli",
    name:"Nimi",
    success_in_registeration:"Rekisteräinti onnistui ja vahvistus sähköposti on lähetetty.",
    selectPrivacyPolicy: "Valitse tietosuojakäytäntö.",
    neverShareName: "Emme koskaan jaa nimeäsi kenenkään muun kanssa.",
    neverShareGender: "Emme koskaan jaa sukupuoltasi kenenkään muun kanssa.",
    domainInUse: "Sinun on tiedettävä käytössä oleva oikea verkkotunnus.",
    neverShareDomain: "Emme koskaan jaa verkkotunnustasi kenenkään muun kanssa.",
    passwordStronglyCrypted: "Salasana on vahvasti salattu ja turvallinen tietokannassamme.",
    privacyPolicy: "Tietosuojakäytäntö",
    dataProcessingAgreement: "Tietojenkäsittelysopimus",
    agreedOn: "Hyväksyt",
    and: "ja",
    required: "Vaadittu",
    register: "Rekisteröidy",
    loginHere: "Kirjaudu tästä",
    tooLong: "Liian pitkä!",
    tooShort: "Liian lyhyt!",
    invalidEmail: "Virheellinen sähköpostiosoite",
    invalidDomain: "Verkkotunnus on virheellinen",
    passwordsDontMatch: "Salasanan ja vahvistetun salasanan tulee olla sama."
  },
  se: {
    email: "E-post",
    enteremail: "Ange din e-postadress",
    newershare: "Jag delar aldrig din e-postadress med andra.",
    password: "Lösenord",
    male: "Man",
    female: "Kvinna",
    account: "Har redan ett konto?",
    register: "Registrera",
    confirmPassword: "Bekräfta lösenord",
    domain: "Domän",
    error: "Oväntat fel!",
    gender: "Kön",
    name: "Namn",
    success_in_registeration: "Registreringen lyckades och en bekräftelse har skickats till din e-post.",
    selectPrivacyPolicy: "Välj integritetspolicy.",
    neverShareName: "Vi delar aldrig ditt namn med någon annan.",
    neverShareGender: "Vi delar aldrig ditt kön med någon annan.",
    domainInUse: "Du måste ange en giltig domän som inte redan är i användning.",
    neverShareDomain: "Vi delar aldrig din domän med någon annan.",
    passwordStronglyCrypted: "Ditt lösenord är starkt krypterat och säkert i vår databas.",
    privacyPolicy: "Integritetspolicy",
    dataProcessingAgreement: "Dataprocessavtal",
    agreedOn: "Jag godkänner",
    and: "och",
    required: "Obligatoriskt",
    register: "Registrera",
    loginHere: "Logga in här",
    tooLong: "För långt!",
    tooShort: "För kort!",
    invalidEmail: "Ogiltig e-postadress",
    invalidDomain: "Ogiltig domän",
    passwordsDontMatch: "Lösenorden matchar inte."
},
de: {
  email: "E-Mail",
  enteremail: "Bitte geben Sie Ihre E-Mail-Adresse ein",
  newershare: "Wir teilen Ihre E-Mail-Adresse niemals mit anderen.",
  password: "Passwort",
  male: "Männlich",
  female: "Weiblich",
  account: "Ich habe bereits ein Konto",
  register: "Registrieren",
  confirmPassword: "Passwort bestätigen",
  domain: "Domain",
  error: "Unerwarteter Fehler!",
  gender: "Geschlecht",
  name: "Name",
  success_in_registeration: "Registrierung erfolgreich abgeschlossen. Eine Bestätigungs-E-Mail wurde gesendet.",
  selectPrivacyPolicy: "Bitte wählen Sie die Datenschutzrichtlinie aus.",
  neverShareName: "Wir teilen Ihren Namen niemals mit anderen.",
  neverShareGender: "Wir teilen Ihr Geschlecht niemals mit anderen.",
  domainInUse: "Sie müssen die tatsächlich verwendete Domain kennen.",
  neverShareDomain: "Wir teilen Ihre Domain niemals mit anderen.",
  passwordStronglyCrypted: "Das Passwort ist sicher in unserer Datenbank verschlüsselt.",
  privacyPolicy: "Datenschutzrichtlinie",
  dataProcessingAgreement: "Datenschutzvereinbarung",
  agreedOn: "Ich stimme zu",
  and: "und",
  required: "Erforderlich",
  register: "Registrieren",
  loginHere: "Hier einloggen",
  tooLong: "Zu lang!",
  tooShort: "Zu kurz!",
  invalidEmail: "Ungültige E-Mail-Adresse",
  invalidDomain: "Ungültige Domain",
  passwordsDontMatch: "Passwort und Bestätigung müssen übereinstimmen."
},
pl: {
  email: "E-mail",
  enteremail: "Wprowadź adres e-mail",
  newershare: "Nigdy nie udostępniamy Twojego adresu e-mail innym osobom.",
  password: "Hasło",
  male: "Mężczyzna",
  female: "Kobieta",
  account: "Masz już konto?",
  register: "Zarejestruj się",
  confirmPassword: "Potwierdź hasło",
  domain: "Domena",
  error: "Nieoczekiwany błąd!",
  gender: "Płeć",
  name: "Imię",
  success_in_registeration: "Rejestracja zakończona sukcesem. E-mail potwierdzający został wysłany.",
  selectPrivacyPolicy: "Wybierz politykę prywatności.",
  neverShareName: "Nigdy nie udostępniamy Twojego imienia innym osobom.",
  neverShareGender: "Nigdy nie udostępniamy Twojej płci innym osobom.",
  domainInUse: "Musisz znać rzeczywistą używaną domenę.",
  neverShareDomain: "Nigdy nie udostępniamy Twojej domeny innym osobom.",
  passwordStronglyCrypted: "Hasło jest silnie zaszyfrowane i bezpieczne w naszej bazie danych.",
  privacyPolicy: "Polityka prywatności",
  dataProcessingAgreement: "Umowa przetwarzania danych",
  agreedOn: "Zgadzam się",
  and: "i",
  required: "Wymagane",
  loginHere: "Zaloguj się tutaj",
  tooLong: "Za długie!",
  tooShort: "Za krótkie!",
  invalidEmail: "Nieprawidłowy adres e-mail",
  invalidDomain: "Nieprawidłowa domena",
  passwordsDontMatch: "Hasło i potwierdzenie hasła muszą być identyczne."
},
 });

 var query = window.location.search.substring(1);
 var urlParams = new URLSearchParams(query);
 var localization = urlParams.get('lang');

 if (localization==null) {
   strings.setLanguage(API_DEFAULT_LANGUAGE);
 } else {
   strings.setLanguage(localization);
 }

const SignupSchema = Yup.object().shape({
    name: Yup.string().required(strings.required).max(32, strings.tooLong),
    gender: Yup.string().required(strings.required).max(6, strings.tooLong),
    email: Yup.string()
      .email(strings.invalidEmail)
      .required(strings.required)
      .max(64, strings.tooLong),
    domain: Yup.string()
      .matches(/([a-z0-9]+\.)*[a-z0-9]+\.[a-z]+/, strings.invalidDomain)
      .required(strings.required),
    password: Yup.string()
      .required(strings.required)
      .min(8, strings.tooShort)
      .max(32, strings.tooLong),
    confirmPassword: Yup.string()
      .required(strings.required)
      .oneOf(
        [Yup.ref("password"), null],
        strings.passwordsDontMatch
      ),
});

function RegistrationForm(props) {
  const [state, setState] = useState({
    name: "",
    email: "",
    domain: "",
    password: "",
    confirmPassword: "",
    successMessage: null,
    gender: "male"
  });

  const [error, setError] = useState(null);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaSuccess, setCaptchaSuccess] = useState(false);

  const {authState, authActions} = React.useContext(AuthContext);
  const [setting, setSetting] = React.useState({
    show_captcha: false,
    disable_registeration_from_others: false
  });

  useEffect(()=>{
    // setLoading(true);
    request()
      .get("/api/settings")
      .then(res => {
        if(res.status == 200 ){
          // setLoading(false);
            const obj = {};
            for (let i = 0; i < res.data.data.length; i++) {
                const element = res.data.data[i];
                if(element.setting_value == "1"){
                    obj[element.setting_key] = true 
                }
                if(element.setting_value == "0"){
                    obj[element.setting_key] = false 
                }
            }
            setSetting(obj);
        }

      })
  },[])

  const sendDetailsToServer = (values, formProps) => {
    setLoading(true);
    request()
      .post(API_BASE_URL + "/api/users/register", values)
      .then(function (response) {
        const json_parsed = response.data
        debugger
        if (json_parsed.success === true) {
          setState(prevState => ({
            ...prevState,
            successMessage:
              strings.success_in_registeration,
          }));
          setError(null);

          setLoading(false);
          setTimeout(()=>{
            redirectToLogin();
          },5000)
        } else {
          setLoading(false);
          console.log(json_parsed.data);
          for (const key in json_parsed.data.data) {
            if (Object.hasOwnProperty.call(json_parsed.data.data, key)) {
              const element = json_parsed.data.data[key];
              formProps.setFieldError(key, element[0]);
            }
          }
        }
      })
      .catch(function (error) {
        setLoading(false);
        console.log(error);
      });
  };
  const redirectToLogin = () => {
    props.updateTitle("Login");
    props.history.push("/login");
  };

  if (authState.isLogged) {
    return <Redirect to={"/home"}></Redirect>;
  }

  return (
    <div className={"registeration d-flex justify-content-center " }>
        {loading && <div className={"loading-view"} ></div>}
      <div className="animated-card">
        <div className="card col-12 col-lg-6 register-card mt-2">
          <div
            className="alert alert-success mt-2"
            style={{display: state.successMessage ? "block" : "none"}}
            role="alert"
          >
            {state.successMessage}
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              domain: "",
              password: "",
              confirmPassword: "",
              gender: "male",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, formProps) => {
              if(agree == true){
                sendDetailsToServer(values, formProps);
              }
            }}
          >
            {({values, errors, submitCount}) => {
              return (
                <Form className="Register-form"> 
                  {
                    submitCount > 0 && agree == false && <div className="alert alert-danger" >{strings.selectPrivacyPolicy}</div>
                  }
                  <div className="form-group text-left">
                    <TextInput
                      label={strings.name}
                      placeholder="John Doe"
                      name="name"
                    />
                    <small id="domainHelp" className="form-text text-muted">
                      {strings.neverShareName}
                    </small>
                  </div>
                  <div className="form-group text-left">
                    <label for="gender" className="select-gender-label">
                      {strings.gender}
                    </label>
                    <br />
                    <Field className="select-gender" as="select" name="gender">
                      <option value="male">{strings.male}</option>
                      <option value="female">{strings.account.female}</option>
                    </Field>
                    <br />
                    <small id="domainHelp" className="form-text text-muted">
                      {strings.neverShareGender}
                    </small>
                  </div>
                  {!setting.disable_registeration_from_others &&
                  <div className="form-group text-left">
                    <TextInput
                      label={strings.email}
                      placeholder="john.doe@domain.com"
                      name="email"
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      {strings.newershare}
                    </small>
                  </div>
                  }
                  {setting.disable_registeration_from_others &&
                  <div className="form-group text-left">
                    <TextInput
                      label={strings.email}
                      placeholder="john.doe@i4ware.fi"
                      name="email"
                    />
                    <small id="emailHelp" className="form-text text-muted">
                      {strings.newershare}
                    </small>
                  </div>
                  }
                  {setting.disable_registeration_from_others &&
                  <div className="form-group text-left">
                    <TextInput
                      label={strings.domain}
                      name="domain"
                    />
                    <small id="domainHelp" className="form-text text-muted">
                      {strings.domainInUse}
                    </small>
                  </div>
                  }
                  {!setting.disable_registeration_from_others &&
                  <div className="form-group text-left">
                    <TextInput
                      label={strings.domain}
                      placeholder="www.domain.com"
                      name="domain"
                    />
                    <small id="domainHelp" className="form-text text-muted">
                      {strings.neverShareDomain}
                    </small>
                  </div>
                  }
                  <div className="form-group text-left">
                    <label for="validationCustom03" className={"form-label"}>
                      {strings.password}
                    </label>
                    <PassWordInput
                      label={strings.password}
                      placeholder=""
                      name="password"
                      type="password"
                    />
            <small id="emailHelp" className="form-text text-muted">
            {strings.passwordStronglyCrypted}
            </small>
                  </div>
                  <div className="form-group text-left">
                    <label for="validationCustom03" className={"form-label"}>
                      {strings.confirmPassword}
                    </label>
                    <PassWordInput
                      label={strings.confirmPassword}
                      placeholder=""
                      name="confirmPassword"
                      type="password"
                    />
            <small id="emailHelp" className="form-text text-muted">
            {strings.passwordStronglyCrypted}
            </small>
                  </div>
                  {setting.show_captcha && <div className="mt-2">
                    <Captcha onChange={status => setCaptchaSuccess(status)} />
                  </div>}
                  <div className="form-group form-check mt-2">
                    <input type="checkbox" className="form-check-input" id="term" value={"agree"} onChange={(e)=>{
                      if(e.target.checked){
                        setAgree(true);
                      }else{
                        setAgree(false);
                      }
                    }} />
                    <label className="form-check-label" for="term">
                      {strings.agreedOn}{" "}
                      <a href="https://www.i4ware.fi/#privacy" target="_blank">{strings.privacyPolicy}</a>{" "}
                      {strings.and} <a href="https://www.i4ware.fi/#data" target="_blank"> {strings.dataProcessingAgreement} </a>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary mt-3"
                    disabled={setting.show_captcha?!captchaSuccess:false}
                  >
                    {strings.register}
                  </button>
                </Form>
              );
            }}
          </Formik>
          <div className="mt-2">
            <span className="account-question">{strings.account} </span>
            <span className="loginText" onClick={() => redirectToLogin()}>
              {strings.loginHere}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(RegistrationForm);

