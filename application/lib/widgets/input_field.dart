import 'package:flutter/material.dart';

class InputField extends StatelessWidget {
  final TextEditingController controller;
  final String hint;
  final int maxLines;
  final VoidCallback? onSuffixTap;

  const InputField({
    super.key,
    required this.controller,
    required this.hint,
    this.maxLines = 1,
    this.onSuffixTap,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      maxLines: maxLines,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(color: Colors.white38),
        filled: true,
        // ignore: deprecated_member_use
        fillColor: Colors.white.withOpacity(0.05),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: BorderSide.none,
        ),
        suffixIcon: onSuffixTap == null
            ? null
            : IconButton(
                icon: const Icon(
                  Icons.location_on,
                  color: Colors.blueAccent,
                ),
                onPressed: onSuffixTap,
              ),
      ),
    );
  }
}
