const base = Module.findBaseAddress("libg.so");
const size = Process.getModuleByName("libg.so").size;

console.log("libg.so base:", base);
console.log("libg.so size:", size);

Memory.protect(base, size, 'rwx');
console.log("Memory protection set to RWX");

const RC4_KEY = "fhsd6f86f67rt8fw78fw789we78r9789wer6re";

const csvList = [
	["csv/buildings.csv", 0],
	["csv/locales.csv", 1],
	["csv/resources.csv", 2],
	["csv/characters.csv", 3],
	["csv/animations.csv", 4],
	["csv/projectiles.csv", 5],
	["csv/texts.csv", 6],
	["csv/building_classes.csv", 7],
	["csv/obstacles.csv", 8],
	["csv/effects.csv", 9],
	["csv/particle_emitters.csv", 10],
	["csv/experience_levels.csv", 11],
	["csv/traps.csv", 12],
	["csv/alliance_badges.csv", 13],
	["csv/globals.csv", 14],
	["csv/townhall_levels.csv", 15],
	["csv/alliance_portal.csv", 16],
	["csv/npcs.csv", 17],
	["csv/decos.csv", 18],
	["csv/resource_packs.csv", 19],
	["csv/shields.csv", 20],
	["csv/missions.csv", 21],
	["csv/billing_packages.csv", 22],
	["csv/achievements.csv", 23],
	["csv/credits.csv", 24],
	["csv/faq.csv", 25],
	["csv/spells.csv", 26],
	["csv/hints.csv", 27],
	["csv/heroes.csv", 28],
	["csv/leagues.csv", 29],
	["csv/news.csv", 30],
];

const AF_INET = 2;
const SOCK_STREAM = 1;
const SOL_SOCKET = 1;
const SO_REUSEADDR = 2;
const IPPROTO_IP = 0;
const INADDR_ANY = 0;

const libcName = "libc.so";

const socketFunc = new NativeFunction(Module.findExportByName(libcName, "socket"), "int", ["int", "int", "int"]);
const bindFunc = new NativeFunction(Module.findExportByName(libcName, "bind"), "int", ["int", "pointer", "int"]);
const listenFunc = new NativeFunction(Module.findExportByName(libcName, "listen"), "int", ["int", "int"]);
const acceptFunc = new NativeFunction(Module.findExportByName(libcName, "accept"), "int", ["int", "pointer", "pointer"]);
const recvFunc = new NativeFunction(Module.findExportByName(libcName, "recv"), "int", ["int", "pointer", "int", "int"]);
const htons = new NativeFunction(Module.findExportByName(libcName, "htons"), "uint16", ["uint16"]);
const setsockoptFunc = new NativeFunction(Module.findExportByName(libcName, "setsockopt"), "int", ["int", "int", "int", "pointer", "int"]);
const malloc = new NativeFunction(Module.findExportByName(libcName, "malloc"), "pointer", ["int"]);
const free = new NativeFunction(Module.findExportByName(libcName, "free"), "void", ["pointer"]);

const MessagingCtorPtr = base.add(0x1B5984 + 1);
const MessagingOnReceivePtr = base.add(0x1B61F4 + 1);
const MessagingNextMessagePtr = base.add(0x1B5D88 + 1);
const LogicMagicMessageFactoryCtorPtr = base.add(0x18EE88 + 1);
const RC4EncrypterCtorPtr = base.add(0x1DE1A0 + 1);
const MessagingSetEncryptersPtr = base.add(0x1B58D4 + 1);
const StringCtorPtr = base.add(0x1B78EC + 1);
const ResourceManagerInitPtr = base.add(0x1DF3B0 + 1);
const DataLoaderFactoryPtr = base.add(0x1E0948 + 1);
const LogicDataTablesInitPtr = base.add(0x1748F0 + 1);
const LoginOkMessageCtorPtr = base.add(0x1A5D10 + 1);
const MessagingSendPtr = base.add(0x1B5CB4 + 1);
const MessagingOnWakeupPtr = base.add(0x1B6120 + 1);
const OwnHomeDataMessageCtorPtr = base.add(0x1AE448 + 1);
const ResourceManagerGetJSONPtr = base.add(0x1DFC00 + 1);
const LogicClientHomePtr = base.add(0x18BB9C + 1);
const StringBuilderCtorPtr = base.add(0x1B99B4 + 1);
const LogicJSONObjectPtr = base.add(0x1F253C + 1);
const StringBuilderToStringPtr = base.add(0x1B8CB4 + 1);
const LogicClientHomeSetHomeJSONPtr = base.add(0x18BD00 + 1);
const LogicClientAvatarGetDefaultAvatarPtr = base.add(0x162890 + 1);
const ResourceListenerCtorPtr = base.add(0x1DE328 + 1);
const ResourceListenerAddFilePtr = base.add(0x1DE558 + 1);
const ResourceListenerStartLoadingPtr = base.add(0x1DE60C + 1);
const ResourceManagerLoadNextResourcePtr = base.add(0x1DF858 + 1);
const ResourceManagerResourceToLoadPtr = base.add(0x1DFB70 + 1);
const InitModeCtorPtr = base.add(0x14E4D0 + 1);
const InitModeUpdateLoadingPtr = base.add(0x14E8F0 + 1);
const LogicDataTablesCreateReferencesPtr = base.add(0x174B0C + 1);
const LogicResourcesCreateDataTableResourcesArrayPtr = base.add(0x181564 + 1);
const ResourceManagerGetCSVPtr = base.add(0x1DFBB8 + 1);
const LogicResourcesLoadPtr = base.add(0x181ADC + 1);
const LogicDataTableResourceGetFileNamePtr = base.add(0x174684 + 1);
const ResourceManagerAndroidAssetManagerPtr = base.add(0x2F718C);

const fMessagingCtor = new NativeFunction(MessagingCtorPtr, "void", ["pointer", "int"]); 
const fMessagingOnReceive = new NativeFunction(MessagingOnReceivePtr, "void", ["pointer", "pointer"]);
const fMessagingNextMessage = new NativeFunction(MessagingNextMessagePtr, "pointer", ["pointer"]); 
const fLogicMagicMessageFactoryCtor = new NativeFunction(LogicMagicMessageFactoryCtorPtr, "void", ["pointer"]);
const fRC4EncrypterCtor = new NativeFunction(RC4EncrypterCtorPtr, "void", ["pointer", "pointer", "pointer"]); 
const fMessagingSetEncrypters = new NativeFunction(MessagingSetEncryptersPtr, "void", ["pointer", "pointer", "pointer"]);
const fStringCtor = new NativeFunction(StringCtorPtr, "void", ["pointer", "pointer"]);
const fResourceManagerInit = new NativeFunction(ResourceManagerInitPtr, "pointer", ["pointer", "pointer"]);
const fDataLoaderFactory = new NativeFunction(DataLoaderFactoryPtr, "void", ["pointer"]);
const fLogicDataTablesInit = new NativeFunction(LogicDataTablesInitPtr, "void", []);
const fLoginOkMessageCtor = new NativeFunction(LoginOkMessageCtorPtr, "void", ["pointer"]);
const fMessagingSend = new NativeFunction(MessagingSendPtr, "void", ["pointer", "pointer"]);
const fMessagingOnWakeup = new NativeFunction(MessagingOnWakeupPtr, "void", ["pointer", "pointer"]);
const fOwnHomeDataMessageCtor = new NativeFunction(OwnHomeDataMessageCtorPtr, "void", ["pointer"]);
const fResourceManagerGetJSON = new NativeFunction(ResourceManagerGetJSONPtr, "pointer", ["pointer"]);
const fLogicClientHome = new NativeFunction(LogicClientHomePtr, "void", ["pointer"]);
const fStringBuilderCtor = new NativeFunction(StringBuilderCtorPtr, "void", ["pointer"]);
const fLogicJSONObject = new NativeFunction(LogicJSONObjectPtr, "void", ["pointer", "pointer"]);
const fStringBuilderToString = new NativeFunction(StringBuilderToStringPtr, "pointer", ["pointer"]);
const fLogicClientHomeSetHomeJSON = new NativeFunction(LogicClientHomeSetHomeJSONPtr, "void", ["pointer", "pointer"]);
const fLogicClientAvatarGerDefaultAvatar = new NativeFunction(LogicClientAvatarGetDefaultAvatarPtr, "pointer", []);
const fResourceListenerCtor = new NativeFunction(ResourceListenerCtorPtr, "void", ["pointer"]);
const fResourceListenerAddFile = new NativeFunction(ResourceListenerAddFilePtr, "void", ["pointer", "pointer"]);
const fResourceListenerStartLoading = new NativeFunction(ResourceListenerStartLoadingPtr, "void", ["pointer"]);
const fResourceManagerLoadNextResource = new NativeFunction(ResourceManagerLoadNextResourcePtr, "void", []);
const fResourceManagerResourceToLoad = new NativeFunction(ResourceManagerResourceToLoadPtr, "int", []);
const fInitModeCtor = new NativeFunction(InitModeCtorPtr, "void", ["pointer"]);
const fInitModeUpdateLoading = new NativeFunction(InitModeUpdateLoadingPtr, "void", ["pointer"]);
const fLogicDataTablesCreateReferences = new NativeFunction(LogicDataTablesCreateReferencesPtr, "void", []);
const fLogicResourcesCreateDataTableResourcesArray = new NativeFunction(LogicResourcesCreateDataTableResourcesArrayPtr, "pointer", []);
const fResourceManagerGetCSV = new NativeFunction(ResourceManagerGetCSVPtr, "pointer", ["pointer"]);
const fLogicResourcesLoad = new NativeFunction(LogicResourcesLoadPtr, "void", ["pointer", "int", "pointer"]);
const fLogicDataTableResourceGetFileName = new NativeFunction(LogicDataTableResourceGetFileNamePtr, "pointer", ["pointer", "pointer"]);

const Message = {
    _getByteStream: function(message) {
        return message.add(8);
    },
    _getVersion: function(message) {
        return Memory.readInt(message.add(4));
    },
    _setVersion: function(message, version) {
        Memory.writeInt(message.add(4), version);
    },
    _getMessageType: function(message) {
        return (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(20)), 'int', ['pointer']))(message);
    },
    _encode: function(message) {
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(8)), 'void', ['pointer']))(message);
    },
    _decode: function(message) {
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(12)), 'void', ['pointer']))(message);
    },
    _free: function(message) {
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(24)), 'void', ['pointer']))(message);
        (new NativeFunction(Memory.readPointer(Memory.readPointer(message).add(4)), 'void', ['pointer']))(message);
    }
};

const ByteStream = {
    _getOffset: function(byteStream) {
        return Memory.readInt(byteStream.add(16));
    },
    _getByteArray: function(byteStream) {
        return Memory.readPointer(byteStream.add(28));
    },
    _setByteArray: function(byteStream, array) {
        Memory.writePointer(byteStream.add(28), array);
    },
    _getLength: function(byteStream) {
        return Memory.readInt(byteStream.add(20));
    },
    _setLength: function(byteStream, length) {
        Memory.writeInt(byteStream.add(20), length);
    }
};

function createServer(port) {
	initResources();
    var sockfd = socketFunc(AF_INET, SOCK_STREAM, IPPROTO_IP);
    if (sockfd < 0) {
        console.log("Ошибка создания сокета: " + sockfd);
        return;
    }
    console.log("Сокет создан: " + sockfd);
	
	var optval = Memory.alloc(4);
    Memory.writeU32(optval, 1); 
    var ret = setsockoptFunc(sockfd, SOL_SOCKET, SO_REUSEADDR, optval, 4);	

    var sockaddr_in_size = 16;
    var sockaddr = Memory.alloc(sockaddr_in_size);

    Memory.writeU16(sockaddr.add(0), AF_INET);         
    Memory.writeU16(sockaddr.add(2), htons(port));     
    Memory.writeU32(sockaddr.add(4), INADDR_ANY);      
    Memory.writeByteArray(sockaddr.add(8), [0,0,0,0,0,0,0,0]);

    var ret = bindFunc(sockfd, sockaddr, sockaddr_in_size);
    if (ret < 0) {
        console.log("Ошибка привязки (bind): " + ret);
        return;
    }
    console.log("Привязка успешна");

    ret = listenFunc(sockfd, 5);
    if (ret < 0) {
        console.log("Ошибка listen: " + ret);
        return;
    }
    console.log("Прослушивание успешно");

    function acceptLoop() {
        var clientAddrSize = Memory.alloc(4);
        Memory.writeU32(clientAddrSize, sockaddr_in_size);
        var clientSock = acceptFunc(sockfd, sockaddr, clientAddrSize);
        if (clientSock < 0) {
            console.log("[*] Accept error: " + clientSock);
            setImmediate(acceptLoop);
            return;
        }
        console.log("Принято соединение: " + clientSock);
		var messaging = malloc(140);
		fMessagingCtor(messaging, 50);
		messaging.add(60).writeU32(clientSock);
		messaging.add(64).writeU8(1); // isConnected
		
		initializeEncryption(messaging);
		
		var factory = malloc(4);
		fLogicMagicMessageFactoryCtor(factory);
		
		messaging.add(4).writePointer(factory);
		
		console.log("[*] calling onReceive!");
		var connection = messaging.add(60);
		try {
			fMessagingOnReceive(messaging, connection);	
		}
		catch (e) {
			console.log(JSON.stringify(e));
		}
		console.log("[*] onReceive called!");			
		
		var message = fMessagingNextMessage(messaging);
		if (message != null) handleMessage(messaging, message);
		
        setImmediate(acceptLoop);
    }
	
	function handleMessage(messaging, message, messageType = 0) {
		messageType = Message._getMessageType(message);
		switch (messageType) {
			case 10101:
				handleLoginMessage(messaging, message);
				break; 
			default: 
				console.log("[*] Unhandled message: " + messageType);
				break;
		}
	}
	
	function handleLoginMessage(messaging, message) {
		console.log("[*] Login received!");
		console.log("[*] Account ID: " + message.add(48).readPointer().readInt() + " " + message.add(48).readPointer().add(4).readInt());
		console.log("[*] Pass token: " + getStringContent(message.add(52).readPointer()));
		console.log("[*] Client major version: " + message.add(56).readInt());
		console.log("[*] Client build: " + message.add(60).readInt());
		console.log("[*] Resourse SHA: " + getStringContent(message.add(64).readPointer()));
		console.log("[*] UDID: " + getStringContent(message.add(68).readPointer()));
		console.log("[*] ADID: " + getStringContent(message.add(112).readPointer()));
		console.log("[*] OS Version: " + getStringContent(message.add(116).readPointer()));
		console.log("[*] Open UDID: " + getStringContent(message.add(72).readPointer()));
		console.log("[*] Mac address: " + getStringContent(message.add(76).readPointer()));
		console.log("[*] Device: " + getStringContent(message.add(80).readPointer()));
		console.log("[*] Preferred device language: " + getStringContent(message.add(84)));
		console.log("[*] Is Android: " + message.add(168).readU8());
		console.log("[*] IMEI: " + getStringContent(message.add(120)));
		console.log("[*] Android ID: " + getStringContent(message.add(144)));			
		var loginOkMessage = buildLoginOkMessage();
		var ownHomeDataMessage = buildOwnHomeDataMessage();
		fMessagingSend(messaging, loginOkMessage);
		fMessagingSend(messaging, ownHomeDataMessage);
		fMessagingOnWakeup(messaging, messaging.add(60));
		
		console.log("[*] LoginOkMessage has been sent!");
		console.log("[*] ownHomeDataMessage has been sent!");
	}
	
	function buildLoginOkMessage() {
		var message = malloc(116);
		fLoginOkMessageCtor(message);
		
		message.add(48).writePointer(makeLogicLong(0, 1));
		message.add(52).writePointer(makeLogicLong(0, 1));
		
		message.add(56).writePointer(makeString("mostSecureTokenEverByXeon&MrVitalik"));
		
		message.add(76).writeInt(5);
		message.add(80).writeInt(2);
		message.add(84).writeInt(4);
		
		message.add(88).writePointer(makeString("dev"));
		return message;
	}
	
	function buildOwnHomeDataMessage() {
		var message = malloc(60);
		fOwnHomeDataMessageCtor(message);	
		
		var homeJSON = fResourceManagerGetJSON(Memory.allocUtf8String("level/starting_home.json"));
		var logicClientHome = malloc(32);
		fLogicClientHome(logicClientHome);
		
		var stringBuilder = malloc(100);
		fStringBuilderCtor(stringBuilder);
		fLogicJSONObject(homeJSON, stringBuilder);
		var home = fStringBuilderToString(stringBuilder);
		fLogicClientHomeSetHomeJSON(logicClientHome, home);
		
		try {
		var defaultAvatar = fLogicClientAvatarGerDefaultAvatar();
		}
		catch (e) {
			console.log(JSON.stringify(e));
		}
		message.add(52).writePointer(logicClientHome);
		message.add(56).writePointer(defaultAvatar);
		
		return message;
	}
	
	function makeLogicLong(high, low) {
		var logicLong = malloc(8);
		
		logicLong.writeU32(high);
		logicLong.add(4).writeU32(low);
		
		return logicLong;
	}
	
	function makeString(str) {
		var scStr = malloc(24);
		
		fStringCtor(scStr, Memory.allocUtf8String(str));
		
		return scStr;
	}
	
	function initializeEncryption(messaging) {
		var nonce = malloc(24);
		fStringCtor(nonce, Memory.allocUtf8String("nonce"));
		
		var key = malloc(24);
		fStringCtor(key, Memory.allocUtf8String(RC4_KEY));
		
		var encrypter = malloc(264);
		fRC4EncrypterCtor(encrypter, key, nonce);
		
		var decrypter = malloc(264);
		fRC4EncrypterCtor(decrypter, key, nonce);
		
		fMessagingSetEncrypters(messaging, encrypter, decrypter);
	}
	
	function getStringContent(str) {
		// refactored by Xeon
		return str.isNull() ? null : (str.add(4).readInt() + 1 > 8 ? str.add(16).readPointer() : str.add(16)).readUtf8String();
	}
	
	function initResources() {
		var dataLoaderFactory = malloc(4);
		fDataLoaderFactory(dataLoaderFactory);
		
		fResourceManagerInit(dataLoaderFactory, Memory.allocUtf8String(""));
		
		fLogicDataTablesInit();
		
		var resourceListener = malloc(20);
		fResourceListenerCtor(resourceListener);
		fResourceListenerAddFile(resourceListener, makeString("level/starting_home.json"));
		
		for (let i = 1; i <= 48; ++i) {
			fResourceListenerAddFile(resourceListener, makeString(`level/npc${i}.json`));
		}
		
		for (let i = 1; i <= 10; ++i) {
			fResourceListenerAddFile(resourceListener, makeString(`level/townhall${i}.json`));
		}
		
		fResourceListenerAddFile(resourceListener, makeString("level/tutorial_npc.json"));
		fResourceListenerAddFile(resourceListener, makeString("level/tutorial_npc2.json"));
		
		for (const [path] of csvList) {
			fResourceListenerAddFile(resourceListener, makeString(path));			
		}
	
		fResourceListenerStartLoading(resourceListener);
	
		while (ResourceManagerAndroidAssetManagerPtr.readPointer() == 0x0) {
			Thread.sleep(0.5);
		}

		while (fResourceManagerResourceToLoad()) {
			fResourceManagerLoadNextResource();
		}		
		
		free(resourceListener);
		
		var dataTableResourcesArray = fLogicResourcesCreateDataTableResourcesArray();
		for (const [path, index] of csvList) {
			const csv = fResourceManagerGetCSV(makeString(path));
			fLogicResourcesLoad(dataTableResourcesArray, index, csv);
		}
		
		console.log("[*] Resources loaded!");
	}
	
    setImmediate(acceptLoop);
}

createServer(9339);