import { useRef, useState } from "react";
import classes from "./newsletter-registration.module.css";

function NewsletterRegistration() {
  const [isInvalid, setIsInvalid] = useState(false);

  const userEmailRef = useRef();

  async function registrationHandler(event) {
    event.preventDefault();

    // fetch user input (state or refs)
    const userEmail = userEmailRef.current.value;

    // optional: validate input (강사님은 굳이 안하심.. 실제 유효성검사는 api폴더 내에서 실행하고, 이 코드는 단지 유저에게 즉각적인 오류 피드백을 주기 위한 유효성검사이기 때문)
    if (!userEmail || !userEmail.includes("@")) {
      setIsInvalid(true);
    }
    const reqBody = { email: userEmail };

    // send valid data to API
    const res = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(reqBody), // POST(데이터 등록)할 때는 JSON 데이터로 등록!!(밑에 content-type을 json으로 써준 이유..)
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
