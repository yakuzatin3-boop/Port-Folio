import { useEffect, useState } from "react";

const META_APP_ID = import.meta.env.VITE_META_APP_ID;

function FacebookLogin() {
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState("");
  const configurationStatus = META_APP_ID ? "" : "Add VITE_META_APP_ID to enable Facebook login.";

  const handleLoginResponse = (response) => {
    if (response.status !== "connected") {
      setProfile(null);
      return;
    }

    window.FB.api("/me", { fields: "id,name,picture.type(large)" }, (user) => {
      if (user.error) {
        setStatus("Unable to load your Facebook profile.");
        return;
      }

      setProfile({
        id: user.id,
        name: user.name,
        picture: user.picture?.data?.url,
      });
      setStatus("");
    });
  };

  useEffect(() => {
    if (!META_APP_ID) {
      return undefined;
    }

    window.fbAsyncInit = () => {
      window.FB.init({
        appId: META_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v24.0",
      });
      window.FB.getLoginStatus(handleLoginResponse);
    };

    if (!document.getElementById("facebook-jssdk")) {
      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(script);
    } else if (window.FB) {
      window.fbAsyncInit();
    }

    return () => {
      window.fbAsyncInit = undefined;
    };
  }, []);

  const handleLogin = () => {
    if (!window.FB) {
      setStatus("Facebook login is still loading. Please try again.");
      return;
    }

    window.FB.login(handleLoginResponse, { scope: "public_profile" });
  };

  const handleLogout = () => {
    window.FB?.logout(() => {
      setProfile(null);
      setStatus("");
    });
  };

  if (profile) {
    return (
      <div className="facebook-profile" title={`Facebook ID: ${profile.id}`}>
        {profile.picture && <img src={profile.picture} alt="" />}
        <span>{profile.name}</span>
        <button type="button" onClick={handleLogout} aria-label="Log out of Facebook">Log out</button>
      </div>
    );
  }

  return (
    <div className="facebook-login-wrap">
      <button className="facebook-login" type="button" onClick={handleLogin} disabled={!META_APP_ID}>
        Log in with Facebook
      </button>
      {(status || configurationStatus) && <span className="facebook-login-status">{status || configurationStatus}</span>}
    </div>
  );
}

export default FacebookLogin;
