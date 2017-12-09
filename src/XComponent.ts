import * as React from 'react';
import {BehaviorSubject} from "rxjs/BehaviorSubject";

export default abstract class ReXComponent<P, S> extends React.Component<P, S> {
    protected readonly props$: BehaviorSubject<P>;

    constructor(props: P) {
        super(props);
        this.props$ = new BehaviorSubject(props);
    }

    componentWillReceiveProps(newProps: P) {
        this.props$.next(newProps);
    }
}

