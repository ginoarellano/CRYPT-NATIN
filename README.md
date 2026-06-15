CRYPT-NATIN: Enhanced Baybayin Protocol
CRYPT-NATIN is a web-based cryptographic tool that bridges modern information security with traditional Filipino scripts. It offers a unique way to encode messages using a custom protocol inspired by Baybayin.

Features
Phonetic Normalization: Automatically converts modern characters (C, F, J, Q, V, X, Z) to their phonetic equivalents for Baybayin compatibility.

Custom Cipher System: Maps characters to specific Baybayin-based values and applies a Caesar shift.

String Mirroring: Enhances security by reversing the processed numeric output.

Live Trace: Provides a real-time log of the transformation process, making it an excellent educational tool for understanding encryption logic.

How It Works
Normalization: The input is sanitized to ensure all characters are compatible with the Baybayin cipher logic.

Conversion: Characters are mapped to numerical values, followed by a +3 Caesar shift.

Mirroring: The resulting number string is reversed to create the final encrypted code.

Decryption: The process is fully reversible, allowing users to convert numeric codes back into readable text.

Technology Stack
Framework: React

Icons: Lucide-react

Styling: Custom CSS with Noto Sans Tagalog font support
