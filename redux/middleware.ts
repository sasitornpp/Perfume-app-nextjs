import { Middleware } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import {
  addPerfumes,
  addTradablePerfumes,
  removeTradablePerfumes,
} from "./perfume/perfumeReducer";
import { store } from "./Store";
import { RemoveTradablePerfumes } from "@/utils/supabase/api/perfume";
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

const fetchUserAndPerfumes = async () => {
  try {
    await store.dispatch(fetchAuthUser());
    const user = store.getState().user.userAuth;
    if (!user) {
      await store.dispatch(fetchUserDetails(user.id));
    }

    await store.dispatch(fetchPerfumes());
  } catch (error) {
    console.error("Error fetching user and projects:", error);
  }
};

export const subscribeToSessionChanges = () => {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
      fetchUserAndPerfumes();
    }
  });
};