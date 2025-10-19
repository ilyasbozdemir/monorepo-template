package utils

import "golang.org/x/crypto/bcrypt"

// HashPassword bir şifreyi bcrypt ile hash'ler.
func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

// CheckPasswordHash şifrenin hash ile eşleşip eşleşmediğini kontrol eder.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
