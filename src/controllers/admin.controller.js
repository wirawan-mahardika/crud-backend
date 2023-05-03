import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const adminVerification = async (req, res) => {
  const { name, email, goal, language } = req.body;
  if (
    name === "wirawan" &&
    email === "wirawanmahardika10@gmail.com" &&
    goal === "technical architect" &&
    language === "golang"
  ) {
    const token = jwt.sign({ name, email }, process.env.JWT_SECRET, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign(
      { name: name, email: email },
      process.env.REFRESH_JWT_SECRET,
      { expiresIn: "1d" }
    );

    const tokenExp = (jwt.decode(token)).exp

    res.cookie("refreshToken", refreshToken, {
      maxAge: 1000 * 3600 * 24,
      signed: true,
      httpOnly: true,
      sameSite: false
    });

    res
      .status(200)
      .json({ code: 200, message: "Welcome admin", dataToken: {token, exp: tokenExp*1000} });
  } else {
    return res
      .status(401)
      .json({ code: 401, message: "Anda tidak teridentifikasi sebagai admin" });
  }
};


export const refreshToken = (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;

  jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err, admin) => {
    if(err) return res.status(401).json({code: 401, message: err.message})
    const token = jwt.sign({ name: admin.name, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: "15s",
    })
    const tokenExp = (jwt.decode(token)).exp
    return res.status(200).json({code: 200, message: 'Berhasil update token', dataToken: {token, exp: tokenExp*1000}})
  })
  
};


export const adminAuth = (req,res) => {
  const token = (req.headers['authorization']).split(" ")[1]

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
    if(err) return res.status(401).json({code: 401, message: err.message})
    return res.status(200).json({code: 200, message: 'Berhasil login'})
  })
}