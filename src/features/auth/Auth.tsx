import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { User } from "../../interfaces/user.interface";
import * as Yup from "yup";
import http from "../../services/api";
import { saveToken, setAuthState } from "./authSlice";
import { setUser } from "./useSlice";
import { AuthResponse } from "../../services/mirage/routes/user";
import { useAppDispatch } from "../../store";

const schema = Yup.object().shape({
  username: Yup.string()
    .required("what? No Username")
    .max(16, "Username Cannot br longer than 16 characters"),
  password: Yup.string().required('without a password, "None Shall Pass!"'),
  email: Yup.string().email("please provide a valid email address (abc@xy.z)"),
});

const Auth: FC = () => {
  const { handleSubmit, register, errors } = useForm<User>({
    // validationSchema: schema | null,
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const submitForm = (data: User) => {
    const path = isLogin ? "/auth/login" : "/auth/signup";
    http
      .post<User, AuthResponse>(path, data)
      .then((res) => {
        if (res) {
          const { user, token } = res;
          dispatch(saveToken(token));
          dispatch(setUser(user));
          dispatch(setAuthState(true));
        }
      })
      .catch((error) => {
        console.log("ERROR", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <div className="auth">
      <div className="card">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="inputWrapper">
            <input ref={register} name="username" placeholder="Username" />
            {errors && errors.username && (
              <p className="error">{errors.username.message}</p>
            )}
          </div>
          <div className="inputWrapper">
            <input
              ref={register}
              name="password"
              type="password"
              placeholder="Password"
            />
            {errors && errors.password && (
              <p className="error">{errors.password.message}</p>
            )}
          </div>
          {!isLogin && (
            <div className="inputWrapper">
              <input
                ref={register}
                name="email"
                placeholder="Email (optional)"
              />
              {errors && errors.email && (
                <p className="error">{errors.email.message}</p>
              )}
            </div>
          )}
          <div className="inputWrapper">
            <button type="submit" disabled={loading}>
              {isLogin ? "Login" : "Create account"}
            </button>
          </div>
          <p
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: "pointer", opacity: 0.7 }}
          >
            {isLogin ? "No account? Create one" : "Already have an account?"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
