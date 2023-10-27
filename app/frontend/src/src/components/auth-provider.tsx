"use client"

import axios from "axios";
import React, { useEffect, useState, createContext, useContext } from "react";
import * as jose from 'jose'

const AuthContext = createContext<any>(undefined);

const SECRET = new TextEncoder().encode(
  'S3cR3T',
)

export function AuthProvider({
  children
}: {
  children: React.ReactNode
}) {
    const [user, setUser] = useState<any>(null);
    const [userId, setUserId] = useState(0)
    const [initialized, setInitialized] = useState(false);
    const [lsChecked, setLsChecked] = useState(false);

    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND,
      headers: { 'Content-Type': 'application/json' },
    });

    api.interceptors.request.use(
      async (config) => {
        if (isAuthenticated()) {
          config.headers.User = `${userId}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    api.interceptors.response.use(
      (response) => { return response },
      (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          setUserId(0);
          localStorage.removeItem("user_token");
        }
        return error
      }
    )

    useEffect(() => {
      const storedUser = typeof localStorage !== 'undefined' ? localStorage.getItem("user_token") : "";

      if (storedUser) {
        jose.jwtVerify(storedUser || "", SECRET)
          .then(({payload, protectedHeader}) => {

            setLsChecked(true);
            setUserId(payload.user_id as number);
          })
          .catch(e => {
            setUser(null);
            setUserId(0);
            localStorage.removeItem("user_token");
            setLsChecked(true);
            setInitialized(true);
          })
      } else {
        setUser(null);
        setUserId(0);
        localStorage.removeItem("user_token");
        setLsChecked(true);
        setInitialized(true);
      }
    }, []);

    useEffect(() => {
      if (userId && userId > 0) {

        refresh();
      }
    }, [userId])

    useEffect(() => {
      if (!initialized && lsChecked) {
        setInitialized(true);
      }
    }, [user]);

    function login(u: any) {
      const alg = 'HS256'
      
      new jose.SignJWT({ 'user_id': u.id })
        .setProtectedHeader({ alg })
        .sign(SECRET)
        .then((jwt: string) => {
          localStorage.setItem("user_token", jwt);
          setUser(u);
          setUserId(u.id);
        })
    }

    function logout() {
      setUser(null);
      setUserId(0);
      localStorage.removeItem("user_token");
      api.post("/private/auth/logout");
    }

    function refresh() {
      api.get(`/private/user/${userId}`, { headers: { User: `${userId}` } })
        .then((r:any) => {

          setUser(r.data?.data.user);
        })
    }

    function isAuthenticated() {
      return (userId > 0 && user !== null);
    }

    return (
      <AuthContext.Provider value={{
        api,
        user,
        initialized,
        login,
        logout,
        refresh,
        isAuthenticated,
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  }