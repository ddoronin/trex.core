# &lt;T>Rex Core Components

[![Node version](https://img.shields.io/node/v/trex.core.svg?style=flat)](http://nodejs.org/download/)

## Simple Dependency Injection

```typescript
import ServiceLocator from 'trex.core/ServiceLocator';

const api = new ServiceLocator();

export enum Controllers {
    App = 'IAppController',
    Contacts = 'IContactsController',
    Search = 'ISearchController',
    AppFragments = 'IAppFragmentsController',
    CreditCalculator = 'ICreditCalculatorController',
    Weblogs = 'IWeblogController'
}

(function(api: ServiceLocator) {
    api.bind<IAppController>(Controllers.App).to(new AppController());
    api.bind<IContactsController>(Controllers.Contacts).to(new ContactsController());
    api.bind<ISearchController>(Controllers.Search).to(new SearchController());
    api.bind<IAppFragmentsController>(Controllers.AppFragments).to(new AppFragmentsController());
    api.bind<ICreditCalculatorController>(Controllers.CreditCalculator).to(new CreditCalculatorController());
    api.bind<IWeblogController>(Controllers.Weblogs).to(new WeblogController());
})(api);

export default api;
```

## XComponent

React Component Wrapper to support a reactive stream of props.

```typescript
export default abstract class XHttpComponent<P, S extends IFragmentState, T> extends XComponent<P, S> {
    private subscription: Subscription;

    constructor(props: P) {
        super(props);
    }

    componentDidMount() {
        this.subscription = this.props$
            .mergeMap(props => this.sourceData(props))
            .map(httpBag => this.renderFragment(httpBag))
            .subscribe(jsxFragment => {
                this.setState({fragment: jsxFragment});
            });
    }
```


## XHttpComponent

```typescript
interface IProps{
}

class WeblogListWidget extends ReXHttpComponent<IProps, IFragmentState, Array<Weblog>> {
    private readonly weblogController: IWeblogController = Api.get<IWeblogController>(Controllers.Weblogs);

    constructor(props: IProps) {
        super(props);

        this.state = {
            fragment: null
        };
    }

    sourceData(props: IProps) {
        return this.weblogController.list();
    }

    protected renderPending(): JSX.Element {
        return (<span>Loading...</span>);
    }

    protected renderSucceeded(weblogs: Array<Weblog>): JSX.Element {
        return (<article>
            <header>Weblogs:</header>
            <section>
                {
                    weblogs.map(weblog => (
                        <article key={weblog.blogId}>
                            <header>{weblog.title}</header>
                            <section>
                                <p>{weblog.body}</p>
                            </section>
                        </article>
                    ))
                }
            </section>
        </article>);
    }

    protected renderFailed(error: HttpError): JSX.Element {
        return <div>Failed!</div>
    }

    render(): JSX.Element {
        return (
            <article className="weblogs">
                {this.state.fragment}
            </article>
        );
    }
}

export default WeblogListWidget;
```
