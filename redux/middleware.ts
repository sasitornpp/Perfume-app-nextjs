import { Middleware } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client"; 
import {
  addPerfumes,
  addTradablePerfumes,
  removeTradablePerfumes,
} from "./perfume/perfumeReducer";
import { store } from "./Store";
import { RemoveTradablePerfumes } from "@/utils/api/actions-client/perfume";
import { fetchPerfumes } from "@/redux/perfume/perfumeReducer";
import { fetchAuthUser, fetchUserDetails } from "./user/userReducer";

const middleware: Middleware = (store) => {
  return (next) => async (action) => {
    const result = next(action);

    if (addPerfumes.match(action)) {
      console.log("Updated perfumes state:", store.getState().perfume);
    }

    if (addTradablePerfumes.match(action)) {
      console.log(
        "Updated tradable perfumes state:",
        store.getState().perfume.tradeable_perfume
      );
    }

    if (removeTradablePerfumes.match(action)) {
      try {
        const { id } = JSON.parse(action.payload);
        const response = await RemoveTradablePerfumes({ id });

        store.dispatch({
          type: "REMOVE_TRADABLE_PERFUME_SUCCESS",
          payload: response,
        });
      } catch (error) {
        console.error("Error removing tradable perfumes:", error);
        store.dispatch({
          type: "REMOVE_TRADABLE_PERFUME_FAILURE",
          payload: error,
        });
      }
    }

    return result;
  };
};

export default middleware;

const fetchUser = async () => {
  try {
    // Fetch user data from auth first
    await store.dispatch(fetchAuthUser());

    // Retrieve user data from the store
    const user = store.getState().user;
    if (!user.user) {
      await store.dispatch(fetchUserDetails((user.user as any)?.id));
    }
    
    if (user.user && user.authentication) {
      // Fetch projects (perfumes) only if the user is authenticated
      // await store.dispatch(fetchPerfumes());
    }
  } catch (error) {
    console.error("Error fetching user and projects:", error);
  }
};

// Subscribe to session changes
export const subscribeToSessionChanges = () => {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      // เมื่อ session เปลี่ยนแปลงให้เรียก fetchUser ใหม่
      fetchUser();
    }
  });
};