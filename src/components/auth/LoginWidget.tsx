import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import OktaSignIn from '@okta/okta-signin-widget';
import { oktaConfig } from '../../config/oktaConfig';

const LoginWidget: React.FC = (): React.ReactElement | null => {
    const { oktaAuth, authState } = useOktaAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!authState?.isAuthenticated) {
            const onSuccess = async (res: any) => {
                if (res.status === 'SUCCESS') {
                    await oktaAuth.handleLoginRedirect(res.tokens);
                } else {
                    console.log(Error)
                }
            };

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
            navigate('/protected');
        }
    }, [authState?.isAuthenticated, navigate]);

    if (authState?.isPending) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div id="sign-in-widget" />
        </div>
    );
};

export default LoginWidget;
