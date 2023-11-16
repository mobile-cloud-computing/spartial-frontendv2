import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import { oktaConfig } from '../../config/oktaConfig';

const LoginWidget: React.FC = (): React.ReactElement | null => {
    const { oktaAuth, authState } = useOktaAuth();
    const navigate = useNavigate();

    const onSuccess = async (accessTokens: any) => {
        console.log(accessTokens)
        await oktaAuth.handleLoginRedirect(accessTokens);
    };



    React.useEffect(() => {
        if (!authState?.isAuthenticated) {
            const onError = (err: Error) => {
                console.error('sign in error', err);
            };

            const widget = new OktaSignIn(oktaConfig);
            widget.showSignInToGetTokens({
                el: '#sign-in-widget',
                scopes: oktaConfig.scopes,
            }).then(onSuccess).catch(onError);

            return () => widget.remove();
        }
    }, [authState, oktaAuth]);

    React.useEffect(() => {
        if (authState?.isAuthenticated) {
            navigate('/dashboard');
        }
    }, [authState?.isAuthenticated, navigate]);

    if (authState?.isPending) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <main className="main-content mt-3">
                <section>
                    <div className="page-header min-vh-100">
                        <div className="container">
                            <div className="row">
                                <div className="col-10 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 end-0 text-center justify-content-center flex-column">
                                    <div className="position-relative bg-gradient-primary  h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden" style={{ backgroundImage: "url('#')", backgroundSize: "cover" }}>
                                        <span className="mask bg-gradient-primary opacity-6"></span>
                                        <div id="sign-in-widget" className= "justify-content-center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

        </>
    );
};

export default LoginWidget;
