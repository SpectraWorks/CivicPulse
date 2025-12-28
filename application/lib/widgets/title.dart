import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppBarTitle extends StatelessWidget {
  const AppBarTitle({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(Icons.bolt, color: Colors.blueAccent),
        SizedBox(width: 8),
        Text('CivicPulse',style: GoogleFonts.georama(
          fontWeight: FontWeight.bold,
          color: Colors.white),),
      ],
    );
  }
}