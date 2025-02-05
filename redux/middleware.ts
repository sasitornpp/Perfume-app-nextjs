import { Middleware } from '@reduxjs/toolkit';
import { addPerfumes, addTradablePerfumes, removeTradablePerfumes } from './perfume/perfumeReducer';
import { RemoveTradablePerfumes } from '@/utils/api/actions-client/perfume';

const perfumeMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action); // ส่ง action ไปยัง reducer ก่อน

    if (addPerfumes.match(action)) {
        console.log('Updated perfumes state:', store.getState().perfume);
    }

    if (addTradablePerfumes.match(action)) {
        console.log('Updated tradable perfumes state:', store.getState().perfume.tradeable_perfume);
    }

    if (removeTradablePerfumes.match(action)) {
        // ใช้ redux-thunk สำหรับ asynchronous action
        const { id } = JSON.parse(action.payload);
        RemoveTradablePerfumes({ id })
            .then((response) => {
                // ถ้ามีการลบสำเร็จ ก็ dispatch action ที่เกี่ยวข้อง
                store.dispatch({
                    type: 'REMOVE_TRADABLE_PERFUME_SUCCESS',
                    payload: response,
                });
            })
            .catch((error) => {
                console.error('Error removing tradable perfumes:', error);
                store.dispatch({
                    type: 'REMOVE_TRADABLE_PERFUME_FAILURE',
                    payload: error,
                });
            });
    }

    return result;
};

export default perfumeMiddleware;
