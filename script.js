const base = Module.findBaseAddress("libg.so");
const size = Process.getModuleByName("libg.so").size;

console.log("libg.so base:", base);
console.log("libg.so size:", size);

Memory.protect(base, size, 'rwx');
console.log("Memory protection set to RWX");

const RC4_KEY = "fhsd6f86f67rt8fw78fw789we78r9789wer6re";

var AF_INET = 2;
var SOCK_STREAM = 1;
var SOL_SOCKET = 1;
var SO_REUSEADDR = 2;
var IPPROTO_IP = 0;
var INADDR_ANY = 0;

var libcName = "libc.so";

var socketFunc = new NativeFunction(Module.findExportByName(libcName, "socket"), "int", ["int", "int", "int"]);
var bindFunc = new NativeFunction(Module.findExportByName(libcName, "bind"), "int", ["int", "pointer", "int"]);
var listenFunc = new NativeFunction(Module.findExportByName(libcName, "listen"), "int", ["int", "int"]);
var acceptFunc = new NativeFunction(Module.findExportByName(libcName, "accept"), "int", ["int", "pointer", "pointer"]);
var recvFunc = new NativeFunction(Module.findExportByName(libcName, "recv"), "int", ["int", "pointer", "int", "int"]);
var htons = new NativeFunction(Module.findExportByName(libcName, "htons"), "uint16", ["uint16"]);
var setsockoptFunc = new NativeFunction(Module.findExportByName(libcName, "setsockopt"), "int", ["int", "int", "int", "pointer", "int"]);
var malloc = new NativeFunction(Module.findExportByName(libcName, "malloc"), "pointer", ["int"]);

var MessagingCtorPtr = base.add(0x1B5984 + 1);
var MessagingOnReceivePtr = base.add(0x1B61F4 + 1);
var MessagingNextMessagePtr = base.add(0x1B5D88 + 1);
var LogicMagicMessageFactoryCtorPtr = base.add(0x18EE88 + 1);
var RC4EncrypterCtorPtr = base.add(0x1DE1A0 + 1);
var MessagingSetEncryptersPtr = base.add(0x1B58D4 + 1);
var StringCtorPtr = base.add(0x1B78EC + 1);
var ResourceManagerInitPtr = base.add(0x1DF3B0 + 1);
var DataLoaderFactoryPtr = base.add(0x1E0948 + 1);
var LogicDataTablesInitPtr = base.add(0x1748F0 + 1);

var fMessagingCtor = new NativeFunction(MessagingCtorPtr, "void", ["pointer", "int"]); 
var fMessagingOnReceive = new NativeFunction(MessagingOnReceivePtr, "void", ["pointer", "pointer"]);
var fMessagingNextMessage = new NativeFunction(MessagingNextMessagePtr, "pointer", ["pointer"]); 
var fLogicMagicMessageFactoryCtor = new NativeFunction(LogicMagicMessageFactoryCtorPtr, "void", ["pointer"]);
var fRC4EncrypterCtor = new NativeFunction(RC4EncrypterCtorPtr, "void", ["pointer", "pointer", "pointer"]); 
var fMessagingSetEncrypters = new NativeFunction(MessagingSetEncryptersPtr, "void", ["pointer", "pointer", "pointer"]);
var fStringCtor = new NativeFunction(StringCtorPtr, "void", ["pointer", "pointer"]);
var fResourceManagerInit = new NativeFunction(ResourceManagerInitPtr, "pointer", ["pointer", "pointer"]);
var fDataLoaderFactory = new NativeFunction(DataLoaderFactoryPtr, "void", ["pointer"]);
var fLogicDataTablesInit = new NativeFunction(LogicDataTablesInitPtr, "void", []);

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
            console.log("Ошибка accept: " + clientSock);
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
		
		console.log("[*] Вызываем onReceive!");
		var connection = messaging.add(60);
		try {
			fMessagingOnReceive(messaging, connection);	
		}
		catch (e) {
			console.log(JSON.stringify(e));
		}
		console.log("[*] onReceive вызван!");			
		
		var message = fMessagingNextMessage(messaging);
		handleMessage(messaging, message);
		
        //readLoop(clientSock);
        setImmediate(acceptLoop);
    }
	
	function handleMessage(messaging, message, messageType = 0) {
		if (message) messageType = Message._getMessageType(message);
		switch (messageType) {
			case 10101:
				handleLoginMessage();
				break; 
			default: 
				console.log("[*] Unhandled message: " + messageType);
				break;
		}
	}
	
	function handleLoginMessage() {
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
	}
	
	function initializeEncryption(messaging) {
		var nonce = malloc(100);
		fStringCtor(nonce, Memory.allocUtf8String("nonce"));
		
		var key = malloc(100);
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
	}
	
    setImmediate(acceptLoop);
}

createServer(9339);