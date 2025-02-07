import { useState, useEffect } from 'react';

export default function Home() {
    const [appInstalled, setAppInstalled] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);  // Controls visibility of the prompt

    useEffect(() => {
        const checkAppInstalled = () => {

            if (
                window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true
            ) {
                setAppInstalled(true);
            }
        };

        // Capture the beforeinstallprompt event and display the custom prompt
        const handleBeforeInstallPrompt = (event:any) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setShowPrompt(true);  // Show the custom prompt for installation
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        checkAppInstalled();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    // 🛠️ Function to handle the custom install prompt click
    const handleInstallClick = async () => {
        if (deferredPrompt) {
            // @ts-ignore
            deferredPrompt.prompt();
            // @ts-ignore
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('✅ App Installed Successfully!');
                setAppInstalled(true);
            } else {
                console.log('❌ User Dismissed the Install Prompt');
            }
            setDeferredPrompt(null);
            setShowPrompt(false);
        }
    };

    // ❌ Function to hide the install prompt
    const handleDismissPrompt = () => {
        setShowPrompt(false);
    };

    return (
        <div style={{ textAlign: 'center', paddingTop: '20%' }}>
            <h1>{appInstalled ? '✅ ✅App Installed' : '👋 Hello World'}</h1>

            {/* Custom Install Prompt */}
            {showPrompt && (
                <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc' }}>
                    <p>📲 Install this app for a better experience!</p>
                    <button
                        onClick={handleInstallClick}
                        style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
                    >
                        Install
                    </button>
                    <button
                        onClick={handleDismissPrompt}
                        style={{ padding: '10px 20px', cursor: 'pointer' }}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Manual Button in Case the Prompt is Dismissed */}
            {/*<button*/}
            {/*    onClick={handleInstallClick}*/}
            {/*    style={{*/}
            {/*        padding: '10px 20px',*/}
            {/*        fontSize: '18px',*/}
            {/*        backgroundColor: '#0070f3',*/}
            {/*        color: '#fff',*/}
            {/*        border: 'none',*/}
            {/*        borderRadius: '5px',*/}
            {/*        cursor: 'pointer',*/}
            {/*        marginTop: '20px'*/}
            {/*    }}*/}
            {/*>*/}
            {/*    📲 Install App*/}
            {/*</button>*/}
        </div>
    );
}
