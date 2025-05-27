package com.Green_Tech.Green_Tech.Util;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.util.Base64;

public class CryptoUtils {

    private static final String AES = "AES";
    private static final String AES_GCM = "AES/GCM/NoPadding";
    private static final int GCM_IV_LENGTH = 12; // 96 bits
    private static final int GCM_TAG_LENGTH = 128; // 128 bits

    // Encrypt plain text with AES-GCM
    public static String encrypt(String plainText, byte[] key) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_GCM);

        byte[] iv = new byte[GCM_IV_LENGTH];
        SecureRandom random = new SecureRandom();
        random.nextBytes(iv); // generate IV

        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        SecretKeySpec keySpec = new SecretKeySpec(key, AES);

        cipher.init(Cipher.ENCRYPT_MODE, keySpec, spec);
        byte[] encrypted = cipher.doFinal(plainText.getBytes());

        // Prepend IV to encrypted result and base64-encode
        byte[] encryptedWithIv = new byte[iv.length + encrypted.length];
        System.arraycopy(iv, 0, encryptedWithIv, 0, iv.length);
        System.arraycopy(encrypted, 0, encryptedWithIv, iv.length, encrypted.length);

        return Base64.getEncoder().encodeToString(encryptedWithIv);
    }

    // Decrypt AES-GCM encoded text
    public static String decrypt(String encryptedBase64, byte[] key) throws Exception {
        byte[] encryptedWithIv = Base64.getDecoder().decode(encryptedBase64);

        byte[] iv = new byte[GCM_IV_LENGTH];
        byte[] encrypted = new byte[encryptedWithIv.length - GCM_IV_LENGTH];
        System.arraycopy(encryptedWithIv, 0, iv, 0, iv.length);
        System.arraycopy(encryptedWithIv, iv.length, encrypted, 0, encrypted.length);

        Cipher cipher = Cipher.getInstance(AES_GCM);
        GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
        SecretKeySpec keySpec = new SecretKeySpec(key, AES);

        cipher.init(Cipher.DECRYPT_MODE, keySpec, spec);
        byte[] decrypted = cipher.doFinal(encrypted);
        return new String(decrypted);
    }

    // Generate AES 256-bit key
    public static byte[] generateAESKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance(AES);
        keyGen.init(256); // 256-bit key
        SecretKey key = keyGen.generateKey();
        return key.getEncoded();
    }
}
