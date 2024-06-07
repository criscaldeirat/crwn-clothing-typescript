import { AnyAction } from "redux-saga";

//AC - Action Creator (generic)//

type Matchable<AC extends () => AnyAction> = AC & {
    type: ReturnType<AC>['type'];
    match(action: AnyAction): action is ReturnType<AC>;
}

// I may recieve a action creator that has no parameters
export function withMatcher<AC extends () => AnyAction & { type: string }>(actionCreator: AC): Matchable<AC>;
// I may recieve a action creator that has parameters
export function withMatcher<AC extends (...args: any[]) => AnyAction & { type: string }>(actionCreator: AC):Matchable<AC>;

export function withMatcher(actionCreator: Function ) {
    const type = actionCreator().type;
    return Object.assign(actionCreator, {
        type,
        match(action: AnyAction) {
            return action.type === type;
        }
    })
}

export type ActionWithPayload<T, P> = {
    type: T;
    payload: P;
};

export type Action<T> = {
    type: T;
};

//**If a type and a payload are provided it uses this function */
// Having a type and a payload, it will get the ActionWithPayload type
export function createAction<T extends string, P>(type: T, payload: P): ActionWithPayload<T, P>;

//**If only a type is provided, it uses this function  */
// Having a type, and payload defined as void("nothing"), it gets Action type
    // we need to define payload because createAction is expecting to recieve it, so we call it as void
export function createAction<T extends string>(type: T, payload: void): Action<T>;

export function createAction<T extends string, P>(type: T, payload: P) {
    return { type, payload };
};



