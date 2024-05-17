window.addEventListener('message', event => {
  if(event.data.type === 'hsFormCallback' && event.data.eventName === 'onFormReady') {
    
      console.log(`${event.data.id}`);
      
      /* use query selector all in case multiple forms with same id */
      let hsforms = document.querySelectorAll(`#hsForm_${event.data.id}`);

      if (hsforms.length === 0)
      {
       console.log("No form found: check that html is set to true");
      }
      else if(hsforms.length > 1) {
        console.log("Too many forms with same ID");
      }
      else
      {
         let hsform = hsforms[0];

         let country = hsform.querySelector("[name='country_dropdown']");
         let emx_form_type = hsform.querySelector("[name='emx_form_type']");
         let emx_cross_marketing_eligibility = hsform.querySelector("[name='emx_cross_marketing_eligibility']");
         let privacyPolicy = hsform.querySelector(".hs_consent_to_privacy_policy");

         if(country === null || emx_form_type === null || emx_cross_marketing_eligibility === null || privacyPolicy === null) {           
           console.log(`Form found "hsForm_${event.data.id}" but missing required fields: country_dropdown, emx_form_type, emx_cross_marketing_eligibility, consent_to_privacy_policy`)
         }
         else {

           console.log(`Form found "hsForm_${event.data.id}"`);

           let privacyPolicyInput = privacyPolicy.querySelector("input");

           let countrySelectValue = country.value;
           let isUS = (countrySelectValue === "United States") ? true : false;

           let submitButton = hsform.querySelector(".hs_submit");
           let recaptcha = hsform.querySelector(".hs_recaptcha");
           let legalConsentContainer = hsform.querySelector(".legal-consent-container");

          let subscriptionLabel = hsform.querySelectorAll(".legal-consent-container > div.hs-richtext:first-child");

           /* set checkbox label for privacy policy */
           privacyPolicy.querySelector(`[for="consent_to_privacy_policy-${event.data.id}"]`).children[1].innerHTML = "I agree to the EmeraldX <a href='https://www.emeraldx.com/privacy-policy/' target='_blank'>Privacy Policy</a>.<span class='hs-form-required'>*</span>";

           /* define privacy policy label */
            if(emx_form_type.value==="Sponsor") {
              legalConsentContainer.insertAdjacentHTML("afterbegin",`<div class="hs-richtext"><p>By submitting this form, I agree to the EmeraldX <a href='https://www.emeraldx.com/privacy-policy/' target='_blank'>Privacy Policy</a> and understand that my information will be shared with the sponsor(s) of this free resource for relevant follow up.</p></div>`);
            }
            else
            {
              legalConsentContainer.insertAdjacentHTML("afterbegin",`<div class="hs-richtext"><p>By submitting this form, I agree to the EmeraldX <a href='https://www.emeraldx.com/privacy-policy/' target='_blank'>Privacy Policy</a>.</p></div>`);
            }

           /* move privacy policy field into consent container after initial consent text */
           let privacyPolicyFragment = document.createDocumentFragment();
           privacyPolicyFragment.appendChild(privacyPolicy);
           legalConsentContainer.insertBefore(privacyPolicyFragment,legalConsentContainer.children[1]);

           function handleCountryChange(isUS)
           {
             if(isUS)
             { 
               privacyPolicy.style = "display: none";
               handlePrivacyChange(true);
               
               /* move cross marketing to after submit button */
               let crossMarketingFragment = document.createDocumentFragment();        
               crossMarketingFragment.appendChild(hsform.querySelector(".hs_emx_cross_marketing_eligibility"));
               submitButton.appendChild(crossMarketingFragment);

               /* default to i do not wish to receive */
               hsform.querySelector("label[for^='emx_cross_marketing_eligibility0']").parentElement.style = "display: none";
               hsform.querySelector("label[for^='emx_cross_marketing_eligibility1']").parentElement.style = "display: block";

               if(emx_form_type.value==="Sponsor") {
                 hsform.querySelector(`#label-emx_cross_marketing_eligibility-${event.data.id}`).innerHTML = "From time to time, Emerald may wish to contact you about other relevant products and services, as well as other content that may be of interest to you. If you do not wish to receive other relevant communications and offers from Emerald, please check this box:";
               }
               else {
                 hsform.querySelector(`#label-emx_cross_marketing_eligibility-${event.data.id}`).innerHTML = "Emerald is committed to protecting and respecting your privacy, and we'll only use your personal information to provide the products and services you requested from us. From time to time, we may wish to contact you about other products and services, as well as other content that may be of interest to you. If you do not wish to receive other relevant communications and offers, please check this box:";
               }

             }
             else {

               privacyPolicy.style = "display: block";
               handlePrivacyChange(false);

               /* move cross marketing to before submit button */
               let crossMarketingFragment = document.createDocumentFragment();        
               crossMarketingFragment.appendChild(hsform.querySelector(".hs_emx_cross_marketing_eligibility"));
               let recaptchaParent = recaptcha.parentNode;
               recaptchaParent.insertBefore(crossMarketingFragment,recaptcha);

               /* default to i do not wish to receive */
               hsform.querySelector("label[for^='emx_cross_marketing_eligibility0']").parentElement.style = "display: block";
               hsform.querySelector("label[for^='emx_cross_marketing_eligibility1']").parentElement.style = "display: none";

               if(emx_form_type.value==="Sponsor") {
                 hsform.querySelector(`#label-emx_cross_marketing_eligibility-${event.data.id}`).innerHTML = "From time to time, Emerald may wish to contact you about other relevant products and services, as well as other content that may be of interest to you.";
               }
               else {
                 hsform.querySelector(`#label-emx_cross_marketing_eligibility-${event.data.id}`).innerHTML = "Emerald is committed to protecting and respecting your privacy, and we'll only use your personal information to provide the products and services you requested from us. From time to time, we may wish to contact you about other products and services, as well as other content that may be of interest to you.";
               }
             }
           }

           country.addEventListener("change", (event) => {
             countrySelectValue = `${event.target.value}`;
             isUS = (countrySelectValue === "United States") ? true : false;
             if(isUS)
             {
               handleCountryChange(true);

             }
             else
             {
               handleCountryChange(false);

             }
           });

           function handlePrivacyChange(isUS) {

              if (isUS || privacyPolicyInput.checked) {
                 submitButton.querySelector("input[type='submit']").disabled = false;
               }
               else {
                 submitButton.querySelector("input[type='submit']").disabled = true;
               }
           }

             privacyPolicyInput.addEventListener("change", (event) => {
             /* if privacy checked or us then enable submit else disable */
             if(event.target.checked)
             {
                submitButton.querySelector("input[type='submit']").disabled = false;
             }
             else 
             {
               handlePrivacyChange(isUS);
             }
           });

           /* initialize values with default using US view */
           handleCountryChange(true);

           /* if form has subscrptions then move all subscriptions to above legal consent container */
           let subscriptions = hsform.querySelectorAll("[class^='hs_LEGAL_CONSENT.subscription_type']");
           if(subscriptions.length > 0)
           {
             let subscriptionFragment = document.createDocumentFragment();
             
             subscriptions.forEach((subscription) => {
               subscriptionFragment.appendChild(subscription);
             });
             legalConsentContainer.insertBefore(subscriptionFragment,legalConsentContainer.children[0]);
             /* if there is a label above subscriptions then display it */
             if(subscriptionLabel.length > 0)
             {
              legalConsentContainer.insertBefore(subscriptionLabel[0],legalConsentContainer.children[0]);
             }
           }
           else{
            if(subscriptionLabel.length > 0) {
              /* remove label for legitimate interest and if no explicit subscriptions in form*/
              subscriptionLabel[0].remove();
            }
           }
          
           /* defaults to false but sets to true if script runs successfully */
          let emx_has_privacy_policy_script = hsform.querySelector("[name='emx_has_privacy_policy_script']");
          if(emx_has_privacy_policy_script === undefined) {
            /* do nothing if field can't be found*/
          }
          else {
            emx_has_privacy_policy_script.value = 'Yes';
          }


        }
      }
  }
});
