import * as React from "react";
import styles from "./mailing-list.module.scss";

export const MailingList = () => (
  <form
    action="https://app.convertkit.com/forms/1254394/subscriptions"
    className={styles.formkitForm}
    method="post"
    data-sv-form="1254394"
    data-uid="882d42bb6f"
    data-format="inline"
    data-version="5"
    data-options='{"settings":{"after_subscribe":{"action":"redirect","success_message":"Success! Now check your email to confirm your subscription.","redirect_url":"https://unicorn-utterances.com/confirm"},"analytics":{"google":null,"facebook":null,"segment":null,"pinterest":null},"modal":{"trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"powered_by":{"show":true,"url":"https://convertkit.com?utm_source=dynamic&amp;utm_medium=referral&amp;utm_campaign=poweredby&amp;utm_content=form"},"recaptcha":{"enabled":false},"return_visitor":{"action":"hide","custom_content":""},"slide_in":{"display_in":"bottom_right","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15},"sticky_bar":{"display_in":"top","trigger":"timer","scroll_percentage":null,"timer":5,"devices":"all","show_once_every":15}},"version":"5"}&apos;'
    min-width="400 500 600 700 800"
  >
    <h1 className={styles.newsletterHeading}>Newsletter</h1>
    <p>
      Subscribe to our newsletter to get updates on new content we create,
      events we have coming up, and more! We&apos;ll make sure not to spam you
      and provide good insights to the content we have.
    </p>
    <div data-style="clean">
      <ul
        className={`${styles.formkitAlert} ${styles.formkitAlertError}`}
        data-element="errors"
        data-group="alert"
      />
      <div
        data-element="fields"
        data-stacked="false"
        className={styles.formkitFields}
      >
        <div className={styles.formkitField}>
          <input
            className={styles.formkitInput}
            aria-label="Your first name"
            name="fields[first_name]"
            placeholder="Your first name"
            type="text"
            style={{
              color: "rgb(0, 0, 0)",
              borderColor: "rgb(227, 227, 227)",
              borderRadius: "4px",
              fontWeight: "normal",
            }}
          />
        </div>
        <div className={styles.formkitField}>
          <input
            className={styles.formkitInput}
            name="email_address"
            aria-label="Your email address"
            placeholder="Your email address"
            required={true}
            type="email"
            style={{
              color: "rgb(0, 0, 0)",
              borderColor: "rgb(227, 227, 227)",
              borderRadius: "4px",
              fontWeight: "normal",
            }}
          />
        </div>
        <button
          data-element="submit"
          className={styles.formkitSubmit}
          style={{
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgb(18, 125, 179)",
            borderRadius: "4px",
            fontWeight: "normal",
          }}
        >
          <div className={styles.formkitSpinner}>
            <div> </div> <div> </div> <div> </div>
          </div>
          <span> Subscribe </span>
        </button>
      </div>
    </div>
  </form>
);
