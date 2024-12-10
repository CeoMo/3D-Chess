// Initialize Babylon.js
const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);
let isDarkMode = true; // Default theme
let currentTurn = "white"; // Track whose turn it is

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Camera
    const camera = new BABYLON.ArcRotateCamera(
        "camera",
        -Math.PI / 2,
        Math.PI / 2.5,
        15,
        BABYLON.Vector3.Zero(),
        scene
    );
    camera.attachControl(canvas, true);

    // Light
    const light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
    );

    // Chessboard setup
    const boardSize = 8;
    const tileSize = 1;
    const tiles = [];
    const colors = {
        white: new BABYLON.Color3(1, 1, 1),
        black: new BABYLON.Color3(0.2, 0.2, 0.2),
    };

    // Tile materials for light and dark mode
    const lightModeColors = {
        light: new BABYLON.Color3(1, 1, 1),
        dark: new BABYLON.Color3(0.9, 0.9, 0.9),
    };
    const darkModeColors = {
        light: new BABYLON.Color3(0.3, 0.3, 0.3),
        dark: new BABYLON.Color3(0.1, 0.1, 0.1),
    };

    const getTileColors = () =>
        isDarkMode ? darkModeColors : lightModeColors;

    const createOrUpdateTiles = () => {
        const colors = getTileColors();

        for (let row = 0; row < boardSize; row++) {
            tiles[row] = tiles[row] || [];
            for (let col = 0; col < boardSize; col++) {
                let tile = tiles[row][col];
                if (!tile) {
                    tile = BABYLON.MeshBuilder.CreateBox(
                        `tile${row}_${col}`,
                        { size: tileSize, height: 0.2 },
                        scene
                    );
                    tile.position = new BABYLON.Vector3(
                        row - boardSize / 2 + 0.5,
                        0,
                        col - boardSize / 2 + 0.5
                    );
                    tiles[row][col] = tile;
                }
                const tileMaterial =
                    tile.material ||
                    new BABYLON.StandardMaterial(
                        `tileMat${row}_${col}`,
                        scene
                    );
                tileMaterial.diffuseColor =
                    (row + col) % 2 === 0 ? colors.light : colors.dark;
                tile.material = tileMaterial;
            }
        }
    };

    createOrUpdateTiles();

    // Piece setup
    const pieces = [];

    const createPiece = (type, position, color) => {
        let piece;
        switch (type) {
            case "pawn":
                piece = BABYLON.MeshBuilder.CreateSphere(
                    type,
                    { diameter: 0.5 },
                    scene
                );
                break;
            case "rook":
                piece = BABYLON.MeshBuilder.CreateBox(
                    type,
                    { size: 0.7 },
                    scene
                );
                break;
            case "knight":
                piece = BABYLON.MeshBuilder.CreateCylinder(
                    type,
                    { diameter: 0.5, height: 1 },
                    scene
                );
                break;
            case "bishop":
                piece = BABYLON.MeshBuilder.CreateTorus(
                    type,
                    { diameter: 0.7, thickness: 0.15 },
                    scene
                );
                break;
            case "queen":
                piece = BABYLON.MeshBuilder.CreateCylinder(
                    type,
                    { diameter: 0.8, height: 1.5 },
                    scene
                );
                break;
            case "king":
                piece = BABYLON.MeshBuilder.CreateCylinder(
                    type,
                    { diameter: 0.8, height: 1.2 },
                    scene
                );
                break;
            default:
                console.error(`Unknown piece type: ${type}`);
                return null;
        }

        piece.position = position;

        const pieceMaterial = new BABYLON.StandardMaterial(
            `${type}Mat`,
            scene
        );
        pieceMaterial.diffuseColor = color;
        piece.material = pieceMaterial;

        piece.metadata = {
            type: type,
            color: color === colors.white ? "white" : "black",
        };

        pieces.push(piece);
        return piece;
    };

    const createPieces = () => {
        pieces.forEach((piece) => piece.dispose());
        pieces.length = 0;

        // Pawns
        for (let i = 0; i < boardSize; i++) {
            createPiece(
                "pawn",
                new BABYLON.Vector3(i - boardSize / 2 + 0.5, 0.5, -2.5),
                colors.white
            );
            createPiece(
                "pawn",
                new BABYLON.Vector3(i - boardSize / 2 + 0.5, 0.5, 2.5),
                colors.black
            );
        }

        // Rooks
        createPiece(
            "rook",
            new BABYLON.Vector3(-3.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "rook",
            new BABYLON.Vector3(3.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "rook",
            new BABYLON.Vector3(-3.5, 0.5, 3.5),
            colors.black
        );
        createPiece(
            "rook",
            new BABYLON.Vector3(3.5, 0.5, 3.5),
            colors.black
        );

        // Knights
        createPiece(
            "knight",
            new BABYLON.Vector3(-2.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "knight",
            new BABYLON.Vector3(2.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "knight",
            new BABYLON.Vector3(-2.5, 0.5, 3.5),
            colors.black
        );
        createPiece(
            "knight",
            new BABYLON.Vector3(2.5, 0.5, 3.5),
            colors.black
        );

        // Bishops
        createPiece(
            "bishop",
            new BABYLON.Vector3(-1.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "bishop",
            new BABYLON.Vector3(1.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "bishop",
            new BABYLON.Vector3(-1.5, 0.5, 3.5),
            colors.black
        );
        createPiece(
            "bishop",
            new BABYLON.Vector3(1.5, 0.5, 3.5),
            colors.black
        );

        // Queens
        createPiece(
            "queen",
            new BABYLON.Vector3(-0.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "queen",
            new BABYLON.Vector3(-0.5, 0.5, 3.5),
            colors.black
        );

        // Kings
        createPiece(
            "king",
            new BABYLON.Vector3(0.5, 0.5, -3.5),
            colors.white
        );
        createPiece(
            "king",
            new BABYLON.Vector3(0.5, 0.5, 3.5),
            colors.black
        );
    };

    createPieces();

    // UI for turn
    const turnIndicator = document.createElement("div");
    turnIndicator.style.position = "absolute";
    turnIndicator.style.top = "10px";
    turnIndicator.style.right = "10px";
    turnIndicator.style.color = "white";
    turnIndicator.style.fontSize = "20px";
    turnIndicator.style.padding = "10px";
    turnIndicator.style.background = "rgba(0, 0, 0, 0.5)";
    turnIndicator.style.borderRadius = "5px";
    turnIndicator.innerText = `Current Turn: ${currentTurn}`;
    document.body.appendChild(turnIndicator);

    const updateTurn = () => {
        currentTurn = currentTurn === "white" ? "black" : "white";
        turnIndicator.innerText = `Current Turn: ${currentTurn}`;
    };

    // Movement logic
    let selectedPiece = null;
    let validMoves = [];

    const selectPiece = (piece) => {
        if (pieces.includes(piece) && piece.metadata.color === currentTurn) {
            if (selectedPiece) {
                clearHighlights();
            }
            selectedPiece = piece;
            piece.material.emissiveColor = new BABYLON.Color3(0, 1, 0); // Highlight selected piece
            showValidMoves(piece);
        }
    };

    const showValidMoves = (piece) => {
        clearHighlights(); // Reset previous highlights
        const currentTile = tiles
            .flat()
            .find(
                (tile) =>
                    tile.position.x === piece.position.x &&
                    tile.position.z === piece.position.z
            );

        if (!currentTile) return;

        const row = Math.round(
            currentTile.position.x + boardSize / 2 - 0.5
        );
        const col = Math.round(
            currentTile.position.z + boardSize / 2 - 0.5
        );

        validMoves = [];

        switch (piece.metadata.type) {
            case "pawn":
                const dir = piece.metadata.color === "white" ? -1 : 1;
                const nextRow = row;
                const nextCol = col + dir;
                if (
                    nextCol >= 0 &&
                    nextCol < boardSize &&
                    !isOccupied(nextRow, nextCol)
                ) {
                    highlightTile(nextRow, nextCol);
                }
                break;

            case "rook":
                highlightLineMoves(row, col, [
                    { dr: 1, dc: 0 },
                    { dr: -1, dc: 0 },
                    { dr: 0, dc: 1 },
                    { dr: 0, dc: -1 },
                ]);
                break;

            case "bishop":
                highlightLineMoves(row, col, [
                    { dr: 1, dc: 1 },
                    { dr: -1, dc: -1 },
                    { dr: 1, dc: -1 },
                    { dr: -1, dc: 1 },
                ]);
                break;

            case "queen":
                highlightLineMoves(row, col, [
                    { dr: 1, dc: 0 },
                    { dr: -1, dc: 0 },
                    { dr: 0, dc: 1 },
                    { dr: 0, dc: -1 },
                    { dr: 1, dc: 1 },
                    { dr: -1, dc: -1 },
                    { dr: 1, dc: -1 },
                    { dr: -1, dc: 1 },
                ]);
                break;

            case "king":
                highlightMoves(row, col, [
                    { dr: 1, dc: 0 },
                    { dr: -1, dc: 0 },
                    { dr: 0, dc: 1 },
                    { dr: 0, dc: -1 },
                    { dr: 1, dc: 1 },
                    { dr: -1, dc: -1 },
                    { dr: 1, dc: -1 },
                    { dr: -1, dc: 1 },
                ]);
                break;

            case "knight":
                highlightMoves(row, col, [
                    { dr: 2, dc: 1 },
                    { dr: 1, dc: 2 },
                    { dr: -1, dc: 2 },
                    { dr: -2, dc: 1 },
                    { dr: -2, dc: -1 },
                    { dr: -1, dc: -2 },
                    { dr: 1, dc: -2 },
                    { dr: 2, dc: -1 },
                ]);
                break;
        }
    };

    const isOccupied = (row, col) => {
        return pieces.some((piece) => {
            const pieceRow = Math.round(
                piece.position.x + boardSize / 2 - 0.5
            );
            const pieceCol = Math.round(
                piece.position.z + boardSize / 2 - 0.5
            );
            return pieceRow === row && pieceCol === col;
        });
    };

    const highlightTile = (row, col) => {
        const tile = tiles[row][col];
        validMoves.push(tile);
        tile.material.emissiveColor = new BABYLON.Color3(1, 1, 0); // Highlight valid move
    };

    const highlightMoves = (row, col, directions) => {
        directions.forEach(({ dr, dc }) => {
            const newRow = row + dr;
            const newCol = col + dc;
            if (
                newRow >= 0 &&
                newRow < boardSize &&
                newCol >= 0 &&
                newCol < boardSize &&
                !isOccupied(newRow, newCol)
            ) {
                highlightTile(newRow, newCol);
            }
        });
    };

    const highlightLineMoves = (row, col, directions) => {
        directions.forEach(({ dr, dc }) => {
            let newRow = row + dr;
            let newCol = col + dc;
            while (
                newRow >= 0 &&
                newRow < boardSize &&
                newCol >= 0 &&
                newCol < boardSize
            ) {
                if (isOccupied(newRow, newCol)) break;
                highlightTile(newRow, newCol);
                newRow += dr;
                newCol += dc;
            }
        });
    };

    const clearHighlights = () => {
        if (selectedPiece) {
            selectedPiece.material.emissiveColor = new BABYLON.Color3(
                0,
                0,
                0
            ); // Reset piece highlight
        }
        validMoves.forEach((tile) => {
            tile.material.emissiveColor = new BABYLON.Color3(
                0,
                0,
                0
            ); // Reset tile highlight
        });
        validMoves = [];
    };

    scene.onPointerObservable.add((pointerInfo) => {
        switch (pointerInfo.type) {
            case BABYLON.PointerEventTypes.POINTERPICK:
                const pickedMesh = pointerInfo.pickInfo.pickedMesh;

                if (pickedMesh) {
                    if (pieces.includes(pickedMesh)) {
                        selectPiece(pickedMesh);
                    } else if (validMoves.includes(pickedMesh)) {
                        if (selectedPiece) {
                            selectedPiece.position =
                                pickedMesh.position.clone();
                            updateTurn(); // Switch turn after move
                            clearHighlights();
                            selectedPiece = null;
                        }
                    }
                }
                break;
        }
    });

    // Add buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.style.position = "absolute";
    buttonContainer.style.top = "10px";
    buttonContainer.style.left = "10px";
    buttonContainer.style.zIndex = 1000;
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const createButton = (text, onClick) => {
        const button = document.createElement("button");
        button.innerText = text;
        button.style.padding = "10px 20px";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.background =
            "linear-gradient(to right, #6a11cb, #2575fc)";
        button.style.color = "white";
        button.style.cursor = "pointer";
        button.style.boxShadow =
            "0 4px 6px rgba(0, 0, 0, 0.1)";
        button.onclick = onClick;
        buttonContainer.appendChild(button);
    };

    createButton("Toggle Theme", () => {
        isDarkMode = !isDarkMode;
        createOrUpdateTiles();
    });

    createButton("Reset Board", createPieces);

    document.body.appendChild(buttonContainer);

    return scene;
};

const scene = createScene();

// Start the render loop
engine.runRenderLoop(() => {
    scene.render();
});

// Resize the engine on window resize
window.addEventListener("resize", () => {
    engine.resize();
});
