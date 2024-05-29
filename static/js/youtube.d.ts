declare namespace YT {
	class Player {
		constructor(elementId: string, options: PlayerOptions);
	}

	interface PlayerOptions {
		videoId: string;

		playerVars: {
			start: number;
			autoplay: number;
			mute: number;
			controls: number;
			cc_load_policy: number;
			loop: number;
			playlist: string;
		}

		events: {
			onReady: (event: PlayerEvent) => void;
			onError: (event: PlayerEvent) => void;
		}
	}

	interface PlayerEvent {
		target: Player;
	}
}
