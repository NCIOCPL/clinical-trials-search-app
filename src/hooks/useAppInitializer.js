// Context API store
import { useAppSettings } from '../store/store';
import { updateCTXGlobalValue } from '../store/ctx-actions';

let internalAppHasBeenInitialized = false;

export const useAppInitializer = () => {
	// This must be called before any conditionals
	const [, updateAppSettings] = useAppSettings();

	// Prevent this hook from ever being called more than
	// once. Kind of dirty I know...
	if (internalAppHasBeenInitialized) {
		return;
	} else {
		internalAppHasBeenInitialized = true;
	}

	const runQueryStuff = async () => {
		updateAppSettings(
			updateCTXGlobalValue({
				field: 'appHasBeenInitialized',
				value: true,
			})
		);
	};

	// Fire off the async function but do not wait for it to
	// return. (Don't worry, react will stay running and at
	// some point the appHasBeenInitialized will get updated)
	runQueryStuff();
};
