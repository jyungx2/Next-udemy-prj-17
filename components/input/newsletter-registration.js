import { useRef, useState } from "react";
import classes from "./newsletter-registration.module.css";

function NewsletterRegistration() {
  const [isInvalid, setIsInvalid] = useState(false);

  const userEmailRef = useRef();

  async function registrationHandler(event) {
    event.preventDefault();

    // fetch user input (state or refs)
    const userEmail = userEmailRef.current.value;

    // optional: validate input
    if (!userEmail || !userEmail.includes("@")) {
      setIsInvalid(true);
    }
    const reqBody = { email: userEmail };

    // send valid data to API
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <section className={classes.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={classes.control}>
          <input
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email"
            ref={userEmailRef}
          />
          <button>Register</button>
        </div>
      </form>
      {isInvalid && <p>Please enter a valid email address</p>}
    </section>
  );
}

export default NewsletterRegistration;
