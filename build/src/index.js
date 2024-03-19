"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const publicationRoutes_1 = __importDefault(require("./routes/publicationRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const followRoutes_1 = __importDefault(require("./routes/followRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({
    origin: 'http://localhost:5173'
}));
exports.app.use('/user', userRoutes_1.default);
exports.app.use('/publication', authMiddleware_1.authenticateToken, publicationRoutes_1.default);
exports.app.use('/auth', authRoutes_1.default);
exports.app.use('/follow', authMiddleware_1.authenticateToken, followRoutes_1.default);
exports.app.listen(3000, () => {
    console.log('Server ready at localhost:3000');
});
